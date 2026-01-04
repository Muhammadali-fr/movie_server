import { Injectable } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET;
const SHORT_EXPIRE_DATE = "5m";
const LONG_EXPIRE_DATE = "23d";

@Injectable()
export class AuthService {
    async signUp(signUpDto: signUpDto) {
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, signUpDto.email));
        if (existingUser) {
            return { user: existingUser };
        }else{
            return {message: "User not found."}
        }
    };
};
