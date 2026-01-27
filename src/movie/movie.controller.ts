import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }


    @Post("upload")
    @UseInterceptors(FileInterceptor('thumbnail'))
    uploadMovie(
        @Body() body: { title: string },
        @UploadedFile() thumbnail: Express.Multer.File
    ) {
        return this.movieService.uploadMovie(body, thumbnail);
    };
};
