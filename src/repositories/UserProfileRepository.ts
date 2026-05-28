import prisma from "@config/database.js";
import { UserProfile } from "@prisma/client";
import CreateUserProfileDTO from "../models/DTO/UserProfile/CreateUserProfileDTO.js";
import UserProfileDTO from "../models/DTO/UserProfile/UserProfileDTO.js";

export class UserProfileRepository {
    public async create(dto: CreateUserProfileDTO): Promise<UserProfile | null> {
        return await prisma.userProfile.create({
            data: {
                userId: dto.userId,
                roleId: dto.roleId,
                pushNotificationToken: dto.pushNotificationToken ?? null,
            },
        });
    }

    public async get(id: number): Promise<UserProfile | null> {
        return await prisma.userProfile.findUnique({
            where: { id },
            include: { user: true, role: true },
        });
    }

    public async getList(): Promise<UserProfile[]> {
        return await prisma.userProfile.findMany({
            include: { user: true, role: true },
        });
    }

    public async update(dto: UserProfileDTO): Promise<UserProfile> {
        const data: { roleId?: number; pushNotificationToken?: string } = {};
        if (dto.roleId !== undefined) data.roleId = dto.roleId;
        if (dto.pushNotificationToken !== undefined) data.pushNotificationToken = dto.pushNotificationToken;

        return await prisma.userProfile.update({
            where: { id: dto.id },
            data,
        });
    }

    public async delete(id: number): Promise<void> {
        await prisma.userProfile.delete({ where: { id } });
    }
}