import { Controller, Get, Route, Tags } from "tsoa";

@Route("users")     // base URL: /users
@Tags("Users")      // grouping for Swagger
export class UsersController extends Controller {
    @Get("/")
    public async getTest(): Promise<{message: string}> {
        return { message: "ok" };
    }
}

