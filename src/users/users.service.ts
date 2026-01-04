import { Injectable } from '@nestjs/common';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';

const user: typeof usersTable.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
};

@Injectable()
export class UsersService {

    async findAll() {
        return await db.select().from(usersTable);
        // return { message: "Hello world!!!" }
    }

    async create() {
        return await db.insert(usersTable).values(user);
    }
};
