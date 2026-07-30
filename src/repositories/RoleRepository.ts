import prisma from "../config/database.js";
import { Role } from "@prisma/client";
import CreateRoleDTO from "../models/DTO/Role/CreateRoleDTO.js";
import RoleDTO from "../models/DTO/Role/RoleDTO.js";

export class RoleRepository {
    public async create(dto: CreateRoleDTO): Promise<Role | null> {
        return await prisma.role.create({
            data: { title: dto.title },
        });
    }

    public async get(id: number): Promise<Role | null> {
        return await prisma.role.findUnique({
            where: { id },
            include: { profiles: true },
        });
    }

    public async getList(): Promise<Role[]> {
        return await prisma.role.findMany({
            include: { profiles: true },
        });
    }

    public async update(dto: RoleDTO): Promise<Role> {
        return await prisma.role.update({
            where: { id: dto.id },
            data: { title: dto.title },
        });
    }

    public async delete(id: number): Promise<void> {
        await prisma.role.delete({ where: { id } });
    }
}
