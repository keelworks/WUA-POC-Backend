import { Controller, Get, Route, Tags, SuccessResponse, Path } from "tsoa";

@Route("users")     // base URL: /users
export class UsersController extends Controller {
    @Get("/")
    public async getTest(): Promise<{message: string}> {
        return { message: "ok" };
    }
}

