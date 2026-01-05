import { ConflictException, Injectable } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';

const SHORT_EXPIRE_DATE = "5m";
const LONG_EXPIRE_DATE = "23d";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private mailer: MailerService,
    ) { }

    async signUp(signUpDto: signUpDto) {
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, signUpDto.email));

        if (existingUser.length > 0) {
            throw new ConflictException("User already exists.");
        };

        const token = await this.jwtService.signAsync({
            email: signUpDto.email,
            name: signUpDto.name,
            method: "sign-up",
        }, { expiresIn: SHORT_EXPIRE_DATE });

        const link = `${process.env.FRONTEND_URL}/auth/sign-up?token=${token}`;
        this.mailer.sendMail(
            signUpDto.email,
            `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Click to Register</button></a>`,
            "Save your movies for later!"
        );

        return {
            message: `Message sent to ${signUpDto.email}, please verify your email to complete registration.`,
        };
    };
};
