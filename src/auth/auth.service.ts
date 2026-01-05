import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { signUpDto } from './dto/sign-up.dto';
import { signInDto } from './dto/sign-in.dto';

const SHORT_EXPIRE_DATE = "5m";
const LONG_EXPIRE_DATE = "23d";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private mailer: MailerService,
    ) { }

    sendMailFunction(token: string, email: string, method) {
        const link = `${process.env.FRONTEND_URL}/auth/${method}?token=${token}`;
        this.mailer.sendMail(
            email,
            `<a href="${link}"><button style="background-color: #6D28D9; color: white; padding: 10px 20px; border: none; border-radius: 20px; cursor: pointer;">Click here to Continue</button></a>`,
            "Save your movies for later!"
        );

        return {
            message: `Message sent to ${email}, please verify your email to complete registration.`,
        };
    };

    async signUp(signUpDto: signUpDto) {
        const method = "sign-up";
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, signUpDto.email));

        if (existingUser.length > 0) {
            throw new ConflictException("User already exists.");
        };

        const token = await this.jwtService.signAsync({
            email: signUpDto.email,
            name: signUpDto.name,
            method,
        }, { expiresIn: SHORT_EXPIRE_DATE });

        return this.sendMailFunction(token, signUpDto.email, method);
    };

    async signIn(signInDto: signInDto) {
        const method = "sign-in";
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, signInDto.email));

        if (existingUser.length === 0) {
            throw new NotFoundException("User not found.");
        };

        const token = await this.jwtService.signAsync({
            email: signInDto.email,
            method,
        }, { expiresIn: SHORT_EXPIRE_DATE });

        return this.sendMailFunction(token, signInDto.email, method);
    };

    async verifyToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);

            if (payload.method === "sign-up") {
                const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, payload.email));

                if (existingUser.length > 0) {
                    throw new ConflictException("User already exists.");
                };

                await db.insert(usersTable).values({
                    name: payload.name,
                    email: payload.email,
                });

                return { message: "User created successfully." };
            };
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token has expired.');
            };

            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token.');
            };

            throw new UnauthorizedException('Unauthorized.');
        };
    };
};
