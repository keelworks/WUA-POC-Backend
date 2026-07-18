import prisma from "@config/database.js";
import { User } from "@prisma/client";

import CreateUserDTO from "../models/DTO/User/CreateUserDTO.js";
import UserDTO from "../models/DTO/User/UserDTO.js";
import { userWithProfilesInclude, UserWithProfiles } from "../models/DTO/User/UserWithProfiles.js";

import { PasswordHashingService } from "../services/PasswordHashingService.js";

export class UserRepository {
    private _passwordHashingService = new PasswordHashingService();

    public async create(dto: CreateUserDTO): Promise<User | null> {
        // Step 1: Hash the password
        const hashedPassword = await this._passwordHashingService.hashPassword(dto.password);

        // Step 2: Store the hashed password, not the plain text
        const result = await prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,  // ADD THIS LINE
                name: dto.name ?? null,
            },
        });
        return result;
    }

    public async get(id: number): Promise<User | null> {
        const result = await prisma.user.findUnique({
            where: { id },
        });
        return result;
    }

    public async getByEmailWithProfiles(email: string): Promise<UserWithProfiles | null> {
        const result = await prisma.user.findUnique({
            where: { email },
            include: userWithProfilesInclude,
        });
        return result;
    }
    
    public async getList(): Promise<User[]> {
        const result = await prisma.user.findMany();
        return result;
    }

    public async update(dto: UserDTO): Promise<User> {
        const result = await prisma.user.update({
            where: { id: dto.id },
            data: {
                email: dto.email,
                name: dto.name ?? null,
            },
        });
        return result;
    }

    public async delete(id: number): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
    }
}
