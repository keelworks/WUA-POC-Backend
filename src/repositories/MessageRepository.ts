import prisma from "../config/database.js";
import { Message } from "@prisma/client";
import MessageDTO from "../models/DTO/Message/MessageDTO.js";
import CreateMessageDTO from "../models/DTO/Message/CreateMessageDTO.js";

export class MessageRepository {
    public async create(dto: CreateMessageDTO): Promise<Message | null> {
        return await prisma.message.create({
            data: { subject: dto.subject, body: dto.content },
        });
    }

    public async get(id: number): Promise<Message | null> {
        return await prisma.message.findUnique({
            where: { id },
        });
    }

    public async getList(): Promise<Message[]> {
        return await prisma.message.findMany({});
    }

    public async update(dto: MessageDTO): Promise<Message> {
        return await prisma.message.update({
            where: { id: dto.id },
            data: { subject: dto.subject, body: dto.content },
        });
    }

    public async delete(id: number): Promise<void> {
        await prisma.message.delete({ where: { id } });
    }
}
