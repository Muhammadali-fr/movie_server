import { Injectable } from '@nestjs/common';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';

const user: typeof usersTable.$inferInsert = {
    name: 'Muhammadali',
    age: 18,
    email: 'muhammadali.jamolov@gmail.com',
};

@Injectable()
export class UsersService {

    async findAll() {
        return await db.select().from(usersTable);
        // return { message: "Hello world!!!" }
    };

    async create() {
        let createdUser = await db.insert(usersTable).values(user);
        return { message: "user created", "user": createdUser };
    };
};
