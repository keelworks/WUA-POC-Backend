import { Controller, Get, Post, Body, Route, SuccessResponse, Tags } from "tsoa";

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

    // TODO
    public async getUser(): Promise<any> {

    }

    // TODO
    public async updateUser(@Body() requestBody: { email: string; name?: string }): Promise<any> {

    }

    // TODO
    public async deleteUser(): Promise<any> {

    }
}
