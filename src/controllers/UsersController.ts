import { UserRepository } from "@repositories/UserRepository.js";
import { Body, Controller, Delete, Get, Path, Post, Put, Route, SuccessResponse, Tags } from "tsoa";

// DTO = Data Transfer Object — a type that represents the data structure used 
// for communication between layers (e.g. controller to service, or service to repository).
// It may differ from the actual database model (e.g. User) and can be tailored for specific 
// use cases (e.g. CreateUserDTO, UpdateUserDTO). In this example, we are using the User type 
// directly for simplicity, but in a real application, you would likely want to define separate 
// DTOs for create/update operations.
import UserDTO from "../models/DTO/User/UserDTO.js";
import CreateUserDTO from "../models/DTO/User/CreateUserDTO.js";


@Route("users")     // base URL: /users
@Tags("Users")      // grouping for Swagger
export class UsersController extends Controller {
    private _userRepository = new UserRepository();

    @Post()
@SuccessResponse("201", "Created")
public async createUser(
    @Body() requestBody: { email: string; password: string; name?: string }
): Promise<any> {
    // Validate email format
    if (!requestBody.email.includes("@")) {
        this.setStatus(400);
        return { error: "Invalid email format" };
    }

    // Validate password length (minimum 6 chars)
    if (requestBody.password.length < 6) {
        this.setStatus(400);
        return { error: "Password must be at least 6 characters" };
    }

    const dto: CreateUserDTO = {
        email: requestBody.email,
        password: requestBody.password,
        name: requestBody.name,
    } as CreateUserDTO;

    const result = await this._userRepository.create(dto);
    this.setStatus(201);
    return result;
}

    @Get("{id}")
    @SuccessResponse("200", "OK")
    public async getUser(@Path() id: number): Promise<any> {
        const result = await this._userRepository.get(id);
        return result;
    }

    @SuccessResponse("200", "OK")
    public async getUsers(): Promise<any[]> {
        const result = await this._userRepository.getList();
        return result;
    }

    @Put("{id}")
    @SuccessResponse("200", "OK")
    public async updateUser(@Path() id: number, @Body() requestBody: { email: string; name?: string }): Promise<any> {
        const dto: UserDTO = {
            id: id,
            email: requestBody.email,
            name: requestBody.name
        } as UserDTO;
        
        const result = await this._userRepository.update(dto);
        return result;
    }

    @Delete("{id}")
    @SuccessResponse("204", "No Content")
    public async deleteUser(@Path() id: number): Promise<void> {
        await this._userRepository.delete(id);
        this.setStatus(204);
    }
}
