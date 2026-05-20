import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import prisma from "@config/database.js";

const VALID_ROLES = ["Admin", "Normal"];

@Route("roles")
@Tags("Roles")
export class RoleController extends Controller {

    // Get all roles
    @Get()
    @SuccessResponse("200", "OK")
    public async getRoles(): Promise<any[]> {
        return await prisma.role.findMany({ include: { profiles: true } });
    }

    // Get one role by id
    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getRole(@Path() id: number): Promise<any> {
        return await prisma.role.findUnique({
            where: { id },
            include: { profiles: true },
        });
    }

    // Create a role — validates that title is "Admin" or "Normal"
    @Post()
    @SuccessResponse("201", "Created")
    public async createRole(@Body() requestBody: { title: string }): Promise<any> {
        if (!VALID_ROLES.includes(requestBody.title)) {
            this.setStatus(400);
            return { error: `Title must be one of: ${VALID_ROLES.join(", ")}` };
        }

        const result = await prisma.role.create({
            data: { title: requestBody.title },
        });
        this.setStatus(201);
        return result;
    }

    // Update a role
    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateRole(@Path() id: number, @Body() requestBody: { title: string }): Promise<any> {
        if (!VALID_ROLES.includes(requestBody.title)) {
            this.setStatus(400);
            return { error: `Title must be one of: ${VALID_ROLES.join(", ")}` };
        }

        return await prisma.role.update({
            where: { id },
            data: { title: requestBody.title },
        });
    }

    // Delete a role
    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteRole(@Path() id: number): Promise<void> {
        await prisma.role.delete({ where: { id } });
        this.setStatus(204);
    }
}