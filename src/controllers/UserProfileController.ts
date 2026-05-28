import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";
import { UserProfileRepository } from "@repositories/UserProfileRepository.js";
import CreateUserProfileDTO from "../models/DTO/UserProfile/CreateUserProfileDTO.js";
import UserProfileDTO from "../models/DTO/UserProfile/UserProfileDTO.js";

@Route("profiles")
@Tags("UserProfiles")
export class UserProfileController extends Controller {
    private _userProfileRepository = new UserProfileRepository();

@Post()
@SuccessResponse("201", "Created")
public async createProfile(
    @Body() requestBody: { userId: number; roleId: number; pushNotificationToken?: string }
): Promise<any> {
    const dto: CreateUserProfileDTO = {
        userId: requestBody.userId,
        roleId: requestBody.roleId,
        pushNotificationToken: requestBody.pushNotificationToken,
    } as CreateUserProfileDTO;
    const result = await this._userProfileRepository.create(dto);
    this.setStatus(201);
    return result;
}

    @Get()
    @SuccessResponse("200", "OK")
    public async getProfiles(): Promise<any[]> {
        return await this._userProfileRepository.getList();
    }

    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getProfile(@Path() id: number): Promise<any> {
        return await this._userProfileRepository.get(id);
    }

    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateProfile(@Path() id: number, @Body() requestBody: { roleId?: number; pushNotificationToken?: string }): Promise<any> {
        const dto: UserProfileDTO = {
            id: id,
            userId: 0,
            roleId: requestBody.roleId ?? 0,
            pushNotificationToken: requestBody.pushNotificationToken,
        } as UserProfileDTO;
        return await this._userProfileRepository.update(dto);
    }

    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteProfile(@Path() id: number): Promise<void> {
        await this._userProfileRepository.delete(id);
        this.setStatus(204);
    }
}