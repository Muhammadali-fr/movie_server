import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { AwsService } from 'src/aws/aws.service';

@Module({
  controllers: [MovieController],
  providers: [MovieService, AwsService],
})

export class MovieModule { }
