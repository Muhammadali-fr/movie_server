import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AwsService],
})
export class UsersModule { }
