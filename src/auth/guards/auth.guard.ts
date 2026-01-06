import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService
    ) { };

    private extractTokenFromHeader(request:Request) {
        return request;
    };

    async canActivate(context: ExecutionContext) {
        console.log(context);
        const request = context.switchToHttp().getRequest();
        console.log(request);
        return true;
    };
};