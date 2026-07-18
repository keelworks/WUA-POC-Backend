import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import prisma from "@config/database.js";

import { MessageRepository } from "../repositories/MessageRepository.js";

import { NotificationService } from "../services/NotificationService.js";
import MessageDTO from "../models/DTO/Message/MessageDTO.js";

@Route("messages")
@Tags("Messages")
export class MessagesController extends Controller {
    private _messageRepository = new MessageRepository();

    @Post()
    @SuccessResponse("201", "Created")
    public async createMessage(@Body() requestBody: { subject: string; body: string }): Promise<any> {
        const result = await this._messageRepository.create({ subject: requestBody.subject, content: requestBody.body });
        this.setStatus(201);
        return result;
    }

    @Get()
    @SuccessResponse("200", "OK")
    public async getMessages(): Promise<any[]> {
        return await this._messageRepository.getList();
    }

    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getMessage(@Path() id: number): Promise<any> {
        return await this._messageRepository.get(id);
    }

    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateMessage(@Path() id: number, @Body() requestBody: { subject?: string; body?: string }): Promise<any> {
        const dto: MessageDTO = { id, subject: requestBody.subject ?? "", content: requestBody.body ?? "" };
        return await this._messageRepository.update(dto);
    }

    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteMessage(@Path() id: number): Promise<void> {
        await this._messageRepository.delete(id);
        this.setStatus(204);
    }

    @Post("send")
    @SuccessResponse("200", "OK")
    public async sendMessage(@Body() requestBody: { token: string; title: string; message: string }): Promise<any> {
        const service = new NotificationService();
        const tickets = await service.sendNotification(requestBody.token, requestBody.title, requestBody.message);
        return { success: true, tickets };
    }
}
