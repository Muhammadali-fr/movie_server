import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post("sign-up")
    SignUp(
        @Body() signUpDto: signUpDto
    ) {
        return this.authService.signUp(signUpDto);
    };

    @Post("sign-in")
    signIn(
        @Body() signInDto: signInDto
    ) {
        return this.authService.signIn(signInDto);
    };

    @Get("verify-token")
    verifyToken(
        @Query() data: {token:string},
    ) {
        const token = data.token;
        return this.authService.verifyToken(token);
    }
};
