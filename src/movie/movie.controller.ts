import { Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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

    @UseGuards(MovieGuard)
    @Get("get")
    getMovies(@Req() req: any) {
        return this.movieService.getMovies(req.user.id);
    };

    @Get("all")
    getALlMovies() {
        return this.movieService.getAllMovies();
    };
};
