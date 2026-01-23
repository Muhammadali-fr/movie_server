import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// interfaces 
import { IUser } from "./types/user-type";
import { IMagicLinkToken } from "./types/magic-link";

// constantas 
const SHORT_EXPIRE_DATE = "15m";
const LONG_EXPIRE_DATE = "23d";

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService
    ) { }

    generateTokens(payload: IUser) {
        const accessToken = this.jwtService.sign({
            id: payload.id,
            email: payload.email,
        }, { expiresIn: SHORT_EXPIRE_DATE });

        const refreshToken = this.jwtService.sign({
            id: payload.id,
            email: payload.email,
        }, { expiresIn: LONG_EXPIRE_DATE });
        
        return { accessToken, refreshToken };
    };

    magicLinkToken(payload: IMagicLinkToken) {
        return this.jwtService.sign({
            name: payload.name,
            email: payload.email,
            method: payload.method,
        }, { expiresIn: SHORT_EXPIRE_DATE });
    };

    verifyToken(token: string) {
        return this.jwtService.verifyAsync(token);
    };
};