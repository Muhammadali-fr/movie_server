import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post("/sign-up")
    SignUp(
        @Body() SignUpDto: SignUpDto
    ) {
        return this.authService.SignUp(SignUpDto);
    };
};
