import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import prisma from "@config/database.js";

@Route("messages")
@Tags("Messages")
export class MessagesController extends Controller {

    @Post()
    @SuccessResponse("201", "Created")
    public async createMessage(@Body() requestBody: { subject: string; body: string }): Promise<any> {
        const result = await prisma.message.create({
            data: {
                subject: requestBody.subject,
                body: requestBody.body,
            },
        });
        this.setStatus(201);
        return result;
    }

    @Get()
    @SuccessResponse("200", "OK")
    public async getMessages(): Promise<any[]> {
        return await prisma.message.findMany();
    }

    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getMessage(@Path() id: number): Promise<any> {
        return await prisma.message.findUnique({
            where: { id },
        });
    }

    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateMessage(@Path() id: number, @Body() requestBody: { subject?: string; body?: string }): Promise<any> {
    const data: { subject?: string; body?: string } = {};
    if (requestBody.subject !== undefined) data.subject = requestBody.subject;
    if (requestBody.body !== undefined) data.body = requestBody.body;

    return await prisma.message.update({
        where: { id },
        data,
    });
}

    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteMessage(@Path() id: number): Promise<void> {
        await prisma.message.delete({ where: { id } });
        this.setStatus(204);
    }
}