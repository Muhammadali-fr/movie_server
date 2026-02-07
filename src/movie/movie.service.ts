import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { IUser } from './types/user-type';
import { db } from 'src/db/drizzle';
import { moviesTable } from 'src/db/schema';

@Injectable()
export class MovieService {
    constructor(
        private aws: AwsService
    ) { }

    async uploadMovie(user: IUser, body: { title: string }, moviePoster: Express.Multer.File) {
        const { url: moviePosterUrl } = await this.aws.uploadMoviePoster(moviePoster);

        const [movie] = await db.insert(moviesTable)
            .values({
                title: body.title,
                moviePoster: moviePosterUrl ?? null,
                userId: user.id
            }).returning();

        return movie;
    };
};

