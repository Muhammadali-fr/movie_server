import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { signUpDto } from './dto/sign-up.dto';
import { signInDto } from './dto/sign-in.dto';
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { IGoogleUser, IUser } from './types/user-type';
import { TokenService } from './token.service';
import { SendAuthMagicLink } from './magic-link.service';
import { AuthRepositoryService } from './auth-repository';


@Injectable()
export class AuthService {
    constructor(
        private tokenService: TokenService,
        private magicLinkService: SendAuthMagicLink,
        private authRepo: AuthRepositoryService
    ) { }

    async signUp(signUpDto: signUpDto) {
        const METHOD: "sign-up" = "sign-up";
        const existingUser = await this.authRepo.findByEmail(signUpDto.email);
        if (existingUser.length > 0) {
            throw new ConflictException("User already exists. Please sign in.");
        };

        const token = this.tokenService.magicLinkToken({ name: signUpDto.name, email: signUpDto.email, method: METHOD });
        return this.magicLinkService.sendMagicLink({ token, email: signUpDto.email });
    };

    async signIn(signInDto: signInDto) {
        const METHOD: "sign-in" = "sign-in";
        const [existingUser] = await this.authRepo.findByEmail(signInDto.email);

        if (!existingUser) {
            throw new UnauthorizedException("Invalid credentials.");
        };

        if (existingUser.provider === "google") {
            throw new ConflictException("User signed up using Google, so use Google for signing in.");
        };

        const token = this.tokenService.magicLinkToken({ email: existingUser.email, method: METHOD });
        return this.magicLinkService.sendMagicLink({ token, email: existingUser.email });
    };

    async googleLogin(payload: IGoogleUser) {
        const [user] = await this.authRepo.findByEmail(payload.email);

        if (!user) {
            const [newUser] = await this.authRepo.createGoogleUser(payload);
            return this.tokenService.generateTokens(newUser);
        };

        if (user.provider !== 'google') {
            throw new ConflictException('This account was created using email login. Please sign in using email.');
        };

        return this.tokenService.generateTokens(user);
    };

    async verifyToken(token: string) {
        try {
            const payload = await this.tokenService.verifyToken(token);
            const existingUser = await this.authRepo.findByEmail(payload.email);

            if (payload.method === "sign-up") {

                if (existingUser.length > 0) {
                    throw new ConflictException("User already exists.");
                };

                const [newUser] = await this.authRepo.createUser({ name: payload.name, email: payload.email });
                return this.tokenService.generateTokens(newUser);
            };

            if (payload.method === "sign-in") {

                if (existingUser.length === 0) {
                    throw new UnauthorizedException("Invalid credentials.");
                };

                return this.tokenService.generateTokens(existingUser[0]);
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

    async profile(payload: IUser) {
        const [user] = await this.authRepo.findByEmail(payload.email);

        if (!user) {
            throw new NotFoundException('User not found');
        };
        return { user };
    };
};
