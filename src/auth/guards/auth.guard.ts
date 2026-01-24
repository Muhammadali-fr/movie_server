import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "../token.service";

@Injectable()
export class MagicLinkGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private tokenService: TokenService
    ) { };

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const { accessToken, refreshToken } = request.cookies;

        if (!accessToken && !refreshToken)
            throw new UnauthorizedException('Access token cookie not found');

        if (!accessToken && refreshToken) {
            const decoded = await this.jwtService.verifyAsync(refreshToken);
            const { accessToken: newAccessToken } = this.tokenService.generateAccessToken(decoded);
            response.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 15 * 60 * 1000,
            });
            request.user = decoded;
            return true;
        };

        try {
            const decoded = await this.jwtService.verifyAsync(accessToken);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Access token is invalid or expired');
        };
    };
};