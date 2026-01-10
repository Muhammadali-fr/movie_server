import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

// interfaces 
import { IUser } from "./types/user-type";
import { IMagicLinkToken } from "./types/magic-link";

// constantas 
const SHORT_EXPIRE_DATE = "5m";
const LONG_EXPIRE_DATE = "23d";

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService
    ) { }

    generateAccessToken(payload: IUser) {
        return this.jwtService.sign({
            id: payload.id,
            email: payload.email,
        }, { expiresIn: LONG_EXPIRE_DATE });
    };

    magicLinkToken(payload: IMagicLinkToken) {
        return this.jwtService.sign({
            email: payload.email,
            method: payload.method,
        }, { expiresIn: SHORT_EXPIRE_DATE });
    };
};