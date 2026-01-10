import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from 'src/mailer/mailer.module';
import { TokenService } from './token.service';
import "dotenv/config"; 
import { SendAuthMagicLink } from './magic-link.service';
import { AuthRepositoryService } from './auth-repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,TokenService, SendAuthMagicLink, AuthRepositoryService]
})
export class AuthModule { }
