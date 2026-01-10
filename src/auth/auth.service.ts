import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { signUpDto } from './dto/sign-up.dto';
import { signInDto } from './dto/sign-in.dto';
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { IUser } from './types/user-type';
import { TokenService } from './token.service';
import { SendAuthMagicLink } from './magic-link.service';
import { AuthRepository } from './auth-repository';

let METHOD: "sign-in" | "sign-up" | null = null;

@Injectable()
export class AuthService {
    constructor(
        private tokenService: TokenService,
        private magicLinkService: SendAuthMagicLink,
        private authRepo: AuthRepository
    ) { }

    async signUp(signUpDto: signUpDto) {
        METHOD = "sign-up";
        const existingUser = await this.authRepo.findByEmail(signUpDto.email);

        if (existingUser.length > 0) {
            throw new ConflictException("User already exists.");
        };

        const user = existingUser[0];
        const token = this.tokenService.magicLinkToken({ name: user.name, email: user.email, method: METHOD });
        return this.magicLinkService.sendMagicLink({ token, email: user.email });
    };

    async signIn(signInDto: signInDto) {
        METHOD = "sign-in";
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, signInDto.email));

        if (existingUser.length === 0) {
            throw new NotFoundException("User not found.");
        };

        const user = existingUser[0];
        const token = this.tokenService.magicLinkToken({ email: user.email, method: METHOD });
        return this.magicLinkService.sendMagicLink({ token, email: user.email });
    };

    async verifyToken(token: string) {
        try {
            const payload = await this.tokenService.verifyToken(token);

            if (payload.method === "sign-up") {
                const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, payload.email));

                if (existingUser.length > 0) {
                    throw new ConflictException("User already exists.");
                };

                const [newUser] = await db.insert(usersTable).values({
                    name: payload.name,
                    email: payload.email,
                }).returning();
                return { accessToken: this.tokenService.generateAccessToken(newUser) };
            };

            if (payload.method === "sign-in") {
                const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, payload.email));

                if (existingUser.length === 0) {
                    throw new NotFoundException("User not Found.");
                };

                return { accessToken: this.tokenService.generateAccessToken(existingUser[0]) };
            };

            throw new UnauthorizedException("Invalid auth method.");
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

    async profile(IUser: IUser) {
        const user = await db.select().from(usersTable).where(eq(usersTable.email, IUser.email));
        if (user.length === 0) {
            throw new NotFoundException('user not found');
        };
        return user;
    };
};
