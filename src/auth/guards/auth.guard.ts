import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MagicLinkGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) { };

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const token: string | undefined = request.cookies?.accessToken;
        if (!token)
            throw new UnauthorizedException('Access token cookie not found');

        try {
            const decoded = await this.jwtService.verifyAsync(token);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Access token is invalid or expired');
        };
    };
};