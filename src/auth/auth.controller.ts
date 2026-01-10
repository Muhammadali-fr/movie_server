import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';
import { AuthGuard } from './guards/auth.guard';
import type { IUser } from './types/user-type';

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
        @Query() data: { token: string },
    ) {
        const token = data.token;
        return this.authService.verifyToken(token);
    };

    @UseGuards(AuthGuard)
    @Get("profile")
    profile(@Req() req: any) {
        return this.authService.profile(req.user);
    };
};
