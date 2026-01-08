import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) { };

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Token topilmadi (Token header yoq)');
        };

        const [type, token] = authHeader.split(" ");
        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Token toplmadi (Bearer header yoq)');
        }
        
        try {   
            const decoded = this.jwtService.verifyAsync(token);
            request.user = decoded;
            return true;
        } catch (error)     {
            throw new UnauthorizedException('Token notogri');
        };
    };
};