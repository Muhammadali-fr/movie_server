import { Injectable } from '@nestjs/common';

@Injectable()
export class MovieService {
    uploadMovie(body: { title: string }, thumbnail: Express.Multer.File) {
        console.log("body", body.title);
        console.log("thumbnail", thumbnail);
    };
};

