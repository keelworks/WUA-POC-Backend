import { pathToFileURL } from "node:url";

import prisma from "@config/database.js";
import { RoleTitle } from "../models/enums/RoleTitle.js";
import type { PrismaClient, Role, User, UserProfile } from "@prisma/client";

// A structural subset of PrismaClient that covers both the top-level client and
// the transaction client handed to us inside `prisma.$transaction`. Threading
// this type through the helpers lets every step run inside one transaction.
type Db = Pick<PrismaClient, "role" | "user" | "userProfile" | "message">;

// ---------------------------------------------------------------------------
// Seed configuration
// ---------------------------------------------------------------------------
// Emails/names can be overridden with environment variables so the same seed
// works across local, CI, and shared environments without code changes.
interface SeedUserConfig {
    email: string;
    name: string;
    role: RoleTitle;
}

const ADMIN_USER: SeedUserConfig = {
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@wua.local",
    name: process.env.SEED_ADMIN_NAME ?? "Admin User",
    role: RoleTitle.Admin,
};

const TEST_USER: SeedUserConfig = {
    email: process.env.SEED_TEST_EMAIL ?? "test@wua.local",
    name: process.env.SEED_TEST_NAME ?? "Test User",
    role: RoleTitle.Normal,
};

// Starting messages. Message has no unique column in the schema, so these are
// de-duplicated by subject when seeding.
const SEED_MESSAGES: { subject: string; body: string }[] = [
    { subject: "Welcome to WUA", body: "Your account has been set up successfully." },
];

// ---------------------------------------------------------------------------
// Result reporting
// ---------------------------------------------------------------------------
// Every helper reports whether it created a new row or found an existing one,
// so a re-run produces a clear, auditable summary instead of silent no-ops.
type SeedAction = "created" | "existing";

export interface SeedSummary {
    roles: Record<string, SeedAction>;
    users: Record<string, SeedAction>;
    profiles: Record<string, SeedAction>;
    messages: Record<string, SeedAction>;
}

export class SeedService {
    /**
     * Populate the database with the baseline configuration the application
     * needs to run: roles, an admin user, a test user, each user's profile,
     * and any starting messages.
     *
     * The operation is idempotent — running it multiple times will not create
     * duplicates — and atomic — it runs inside a single transaction, so a
     * failure part-way through rolls everything back.
     */
    public async run(): Promise<SeedSummary> {
        const summary = await prisma.$transaction(async (tx) => {
            const db = tx as unknown as Db;

            const roles = await this.seedRoles(db);
            const { users, profiles } = await this.seedUsers(db, [ADMIN_USER, TEST_USER]);
            const messages = await this.seedMessages(db, SEED_MESSAGES);

            return { roles, users, profiles, messages } satisfies SeedSummary;
        });

        this.logSummary(summary);
        return summary;
    }

    // Ensure every role defined in the RoleTitle enum exists exactly once.
    private async seedRoles(db: Db): Promise<Record<string, SeedAction>> {
        const result: Record<string, SeedAction> = {};

        for (const title of Object.values(RoleTitle)) {
            const { action } = await this.ensureRole(db, title);
            result[title] = action;
        }

        return result;
    }

    // Ensure both users and their role-linked profiles exist.
    private async seedUsers(
        db: Db,
        configs: SeedUserConfig[]
    ): Promise<{ users: Record<string, SeedAction>; profiles: Record<string, SeedAction> }> {
        const users: Record<string, SeedAction> = {};
        const profiles: Record<string, SeedAction> = {};

        for (const config of configs) {
            // A user's role must exist before we can attach a profile to it.
            const { role } = await this.ensureRole(db, config.role);

            const { user, action: userAction } = await this.ensureUser(db, config);
            users[config.email] = userAction;

            const { action: profileAction } = await this.ensureProfile(db, user.id, role.id);
            profiles[config.email] = profileAction;
        }

        return { users, profiles };
    }

    // Ensure each seed message exists (de-duplicated by subject).
    private async seedMessages(
        db: Db,
        messages: { subject: string; body: string }[]
    ): Promise<Record<string, SeedAction>> {
        const result: Record<string, SeedAction> = {};

        for (const message of messages) {
            const existing = await db.message.findFirst({ where: { subject: message.subject } });
            if (existing) {
                result[message.subject] = "existing";
                continue;
            }

            await db.message.create({ data: message });
            result[message.subject] = "created";
        }

        return result;
    }

    // --- Entity-level idempotent helpers ------------------------------------

    // Role.title is not unique in the schema, so we cannot upsert; find-first
    // then create.
    private async ensureRole(db: Db, title: RoleTitle): Promise<{ role: Role; action: SeedAction }> {
        const existing = await db.role.findFirst({ where: { title } });
        if (existing) {
            return { role: existing, action: "existing" };
        }

        const role = await db.role.create({ data: { title } });
        return { role, action: "created" };
    }

    // User.email is unique, so a keyed upsert is the clean, race-safe choice.
    private async ensureUser(db: Db, config: SeedUserConfig): Promise<{ user: User; action: SeedAction }> {
        const existing = await db.user.findUnique({ where: { email: config.email } });

        const user = await db.user.upsert({
            where: { email: config.email },
            update: { name: config.name },
            create: { email: config.email, name: config.name },
        });

        return { user, action: existing ? "existing" : "created" };
    }

    // UserProfile has no unique constraint, so guard on (userId, roleId).
    private async ensureProfile(
        db: Db,
        userId: number,
        roleId: number
    ): Promise<{ profile: UserProfile; action: SeedAction }> {
        const existing = await db.userProfile.findFirst({ where: { userId, roleId } });
        if (existing) {
            return { profile: existing, action: "existing" };
        }

        const profile = await db.userProfile.create({ data: { userId, roleId } });
        return { profile, action: "created" };
    }

    private logSummary(summary: SeedSummary): void {
        console.log("Database seed complete:");
        console.log("  Roles:", summary.roles);
        console.log("  Users:", summary.users);
        console.log("  Profiles:", summary.profiles);
        console.log("  Messages:", summary.messages);
    }
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------
// Allows running the seed directly (e.g. `tsx src/services/SeedService.ts`)
// while still exporting SeedService for programmatic use elsewhere.
const isRunDirectly =
    process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isRunDirectly) {
    new SeedService()
        .run()
        .then(() => prisma.$disconnect())
        .then(() => process.exit(0))
        .catch(async (error) => {
            console.error("Database seed failed:", error);
            await prisma.$disconnect();
            process.exit(1);
        });
}