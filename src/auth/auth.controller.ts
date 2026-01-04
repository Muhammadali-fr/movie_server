import { Body, Controller, Post } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post("/sign-up")
    SignUp(
        @Body() signUpDto: signUpDto
    ) {
        return this.authService.signUp(signUpDto);
    };
};
