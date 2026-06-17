import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import type { StringValue } from "ms";

import AuthTokenDTO from "../models/DTO/Auth/AuthTokenDTO.js";
import AuthUserDTO from "../models/DTO/Auth/AuthUserDTO.js";

type JwtPayload = AuthUserDTO & {
    iat?: number;
    exp?: number;
};

export class AuthService {
    public signToken(user: AuthUserDTO): AuthTokenDTO {
        const expiresIn = this.getTokenExpiry();
        const payload: AuthUserDTO = {
            userId: user.userId,
            profileId: user.profileId,
            role: user.role,
        };

        const token = jwt.sign(payload, this.getJwtSecret(), { expiresIn: expiresIn as StringValue });

        return {
            token,
            expiresIn,
            user: payload,
        };
    }

    public verifyToken(token: string): AuthUserDTO {
        try {
            const decoded = jwt.verify(token, this.getJwtSecret());

            if (!this.isAuthUserPayload(decoded)) {
                throw new Error("JWT payload is missing required auth fields");
            }

            return {
                userId: decoded.userId,
                profileId: decoded.profileId,
                role: decoded.role,
            };
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new Error("JWT has expired");
            }

            if (error instanceof JsonWebTokenError) {
                throw new Error("JWT is invalid");
            }

            throw error;
        }
    }

    public getTokenExpiry(): string {
        return process.env.JWT_EXPIRES_IN ?? "1h";
    }

    private getJwtSecret(): string {
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not defined in .env");
        }

        return secret;
    }

    private isAuthUserPayload(payload: unknown): payload is JwtPayload {
        if (!payload || typeof payload !== "object") {
            return false;
        }

        const authPayload = payload as Partial<JwtPayload>;

        return (
            typeof authPayload.userId === "number" &&
            typeof authPayload.profileId === "number" &&
            typeof authPayload.role === "string"
        );
    }
}
