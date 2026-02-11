import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
    ) { };

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { refreshToken } = request.cookies;

        if (!refreshToken)
            throw new UnauthorizedException('Refresh token cookie not found');

        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Refresh token is invalid or expired');
        };
    };
};