import { Injectable } from '@nestjs/common';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';
@Injectable()
export class UsersService {

    async findAll() {
        return await db.select().from(usersTable);
        // return { message: "Hello world!!!" }
    };
};
