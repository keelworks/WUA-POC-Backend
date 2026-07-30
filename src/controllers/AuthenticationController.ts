import { Body, Controller, Post, Route, SuccessResponse, Tags } from "tsoa";

import { AuthService } from "../services/AuthService.js";

@Route("auth")
@Tags("Authentication")
export class AuthenticationController extends Controller {
    private _authService = new AuthService();

    @Post()
    @SuccessResponse("200", "OK")
    public async login(@Body() requestBody: { username: string; password: string }): Promise<any> {
        const result = await this._authService.authenticate(requestBody.username, requestBody.password);
        this.setStatus(200);
        return result;
    }
}
