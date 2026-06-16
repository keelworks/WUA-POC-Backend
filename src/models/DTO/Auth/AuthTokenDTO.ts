import AuthUserDTO from "./AuthUserDTO.js";

export default interface AuthTokenDTO {
    token: string;
    expiresIn: string;
    user: AuthUserDTO;
}
