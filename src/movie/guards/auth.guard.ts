import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MovieGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
    ) { };

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { accessToken } = request.cookies;
        console.log('Request Cookies:', request.cookies);
        console.log('Access Token:', accessToken);

        if (!accessToken)
            throw new UnauthorizedException('Access token cookie not found');

        try {
            const decoded = await this.jwtService.verifyAsync(accessToken);
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Access token is invalid or expired');
        };
    };
};