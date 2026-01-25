import "dotenv/config"
import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { signInDto } from './dto/sign-in.dto';
import { MagicLinkGuard } from './guards/auth.guard';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from "express";

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

    @Get("verify")
    async verifyToken(
        @Query() data: { token: string },
        @Res() res: Response
    ) {
        const { accessToken, refreshToken } = await this.authService.verifyToken(data.token);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 23 * 24 * 60 * 60 * 1000,
        });

        res.json({ message: "setting up cookie" });
    };

    @UseGuards(MagicLinkGuard)
    @Get("profile")
    profile(@Req() req: any) {
        return this.authService.profile(req.user);
    };

    @Get("google")
    @UseGuards(AuthGuard("google"))
    googleLogin(): void {
        return;
    };

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleCallBack(
        @Req() req: any,
        @Res() res: any
    ) {
        const { accessToken, refreshToken } = await this.authService.googleLogin(req.user, res);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 23 * 24 * 60 * 60 * 1000,
        });

        return res.redirect(process.env.FRONTEND_URL as string);
    }; 
};
