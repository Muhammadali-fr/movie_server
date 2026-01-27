import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailerModule } from './mailer/mailer.module';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MailerModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { };
