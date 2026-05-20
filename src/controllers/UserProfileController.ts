import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import prisma from "@config/database.js";

@Route("profiles")
@Tags("UserProfiles")
export class UserProfileController extends Controller {

    // Get all profiles, with their user and role info
    @Get()
    @SuccessResponse("200", "OK")
    public async getProfiles(): Promise<any[]> {
        return await prisma.userProfile.findMany({
            include: { user: true, role: true },
        });
    }

    // Get one profile by id
    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getProfile(@Path() id: number): Promise<any> {
        return await prisma.userProfile.findUnique({
            where: { id },
            include: { user: true, role: true },
        });
    }

    // Create a profile — links a user to a role
    @Post()
    @SuccessResponse("201", "Created")
    public async createProfile(
        @Body() requestBody: { userId: number; roleId: number; pushNotificationToken?: string }
    ): Promise<any> {
        const result = await prisma.userProfile.create({
            data: {
                userId: requestBody.userId,
                roleId: requestBody.roleId,
                pushNotificationToken: requestBody.pushNotificationToken ?? null,
            },
        });
        this.setStatus(201);
        return result;
    }

    // Update a profile — can update role or push token
    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateProfile(
        @Path() id: number,
        @Body() requestBody: { roleId?: number; pushNotificationToken?: string }
    ): Promise<any> {
        const data: { roleId?: number; pushNotificationToken?: string } = {};
        if (requestBody.roleId !== undefined) data.roleId = requestBody.roleId;
        if (requestBody.pushNotificationToken !== undefined) data.pushNotificationToken = requestBody.pushNotificationToken;

        return await prisma.userProfile.update({
            where: { id },
            data,
        });
    }

    // Delete a profile
    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteProfile(@Path() id: number): Promise<void> {
        await prisma.userProfile.delete({ where: { id } });
        this.setStatus(204);
    }
}