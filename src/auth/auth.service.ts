import { Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
    SignUp(SignUpDto: SignUpDto) {
        return SignUpDto.name;
    };
};
