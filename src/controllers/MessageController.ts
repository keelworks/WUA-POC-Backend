import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";

import prisma from "@config/database.js";

@Route("messages")     // base URL: /messages
@Tags("Messages")      // grouping for Swagger
export class MessagesController extends Controller {
    @Post()
    @SuccessResponse("201", "Created")
    public async createMessage(@Body() requestBody: { content: string; userId: number }): Promise<any> {
        const result = await prisma.message.create({
            data: {

            },
        });
        this.setStatus(201);
        return result;
    }

    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getMessage(@Path() id: number): Promise<any> {
        const result = await prisma.user.findUnique({
            where: { id },
        });
        return result;
    }

    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateUser(@Path() id: number, @Body() requestBody: { email: string; name?: string }): Promise<any> {
        const result = await prisma.user.update({
            where: { id },
            data: {
                email: requestBody.email,
                name: requestBody.name ?? null,
            },
        });
        return result;
    }

    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteUser(@Path() id: number): Promise<void> {
        await prisma.user.delete({
            where: { id },
        });
        this.setStatus(204);
    }
}
