import { ConflictException, Injectable } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';

const SHORT_EXPIRE_DATE = "5m";
const LONG_EXPIRE_DATE = "23d";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ){}

    async signUp(signUpDto: signUpDto) {
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, signUpDto.email));
        if (existingUser.length > 0) {
            throw new ConflictException("User already exists.");
        };

        const token = 'token';
    };
};
