import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import { RoleRepository } from "../repositories/RoleRepository.js";
import { VALID_ROLE_TITLES, isValidRoleTitle } from "../models/enums/RoleTitle.js";
import CreateRoleDTO from "../models/DTO/Role/CreateRoleDTO.js";
import RoleDTO from "../models/DTO/Role/RoleDTO.js";

@Route("roles")
@Tags("Roles")
export class RoleController extends Controller {
    private _roleRepository = new RoleRepository();

    // Get all roles
    @Get()
    @SuccessResponse("200", "OK")
    public async getRoles(): Promise<any[]> {
        return await this._roleRepository.getList();
    }

    // Get one role by id
    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getRole(@Path() id: number): Promise<any> {
        return await this._roleRepository.get(id);
    }

    // Create a role — validates that title is "Admin" or "Normal"
    @Post()
    @SuccessResponse("201", "Created")
    public async createRole(@Body() requestBody: { title: string }): Promise<any> {
        if (!isValidRoleTitle(requestBody.title)) {
            this.setStatus(400);
            return { error: `Title must be one of: ${VALID_ROLE_TITLES.join(", ")}` };
        }

        const dto: CreateRoleDTO = { title: requestBody.title };
        const result = await this._roleRepository.create(dto);
        this.setStatus(201);
        return result;
    }

    // Update a role
    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateRole(@Path() id: number, @Body() requestBody: { title: string }): Promise<any> {
        if (!isValidRoleTitle(requestBody.title)) {
            this.setStatus(400);
            return { error: `Title must be one of: ${VALID_ROLE_TITLES.join(", ")}` };
        }

        const dto: RoleDTO = { id, title: requestBody.title };
        return await this._roleRepository.update(dto);
    }

    // Delete a role
    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteRole(@Path() id: number): Promise<void> {
        await this._roleRepository.delete(id);
        this.setStatus(204);
    }
}
