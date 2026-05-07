import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";

import prisma from "@config/database.js";

@Route("users")     // base URL: /users
@Tags("Users")      // grouping for Swagger
export class UsersController extends Controller {
    @Post()
    @SuccessResponse("201", "Created")
    public async createUser(@Body() requestBody: { email: string; name?: string }): Promise<any> {
        const result = await prisma.user.create({
            data: {
                email: requestBody.email,
                name: requestBody.name ?? null,
            },
        });
        this.setStatus(201);
        return result;
    }

    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getUser(@Path() id: number): Promise<any> {
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
