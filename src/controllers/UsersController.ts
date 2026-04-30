import { Controller, Get, Post, Body, Route, SuccessResponse, Tags } from "tsoa";

import prisma from "@config/database.js";

@Route("users")     // base URL: /users
@Tags("Users")      // grouping for Swagger
export class UsersController extends Controller {
    @Post()
    @SuccessResponse("201", "Created")
    public async createUser(@Body() requestBody: { email: string; name?: string }): Promise<void> {
        await prisma.user.create({
            data: {
                email: requestBody.email,
                name: requestBody.name,
            },
        });
        this.setStatus(201);
    }

    // TODO
    public async getUser(): Promise<void> {

    }

    // TODO
    public async updateUser(@Body() requestBody: { email: string; name?: string }): Promise<void> {

    }

    // TODO
    public async deleteUser(): Promise<void> {

    }
}
