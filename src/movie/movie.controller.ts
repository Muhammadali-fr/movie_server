import { Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MovieService } from './movie.service';
import { MovieGuard } from './guards/auth.guard';

@Controller('movie')
export class MovieController {
    constructor(private readonly movieService: MovieService) { }

    @UseGuards(MovieGuard)
    @Post("upload")
    @UseInterceptors(FileInterceptor('moviePoster'))
    uploadMovie(
        @Req() req: any,
        @Body() body: { title: string },
        @UploadedFile() moviePoster: Express.Multer.File
    ) {
        return this.movieService.uploadMovie(req.user, body, moviePoster);
    };
};
