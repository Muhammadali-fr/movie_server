import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from 'src/db/drizzle';
import { usersTable } from "src/db/schema";


@Injectable()
export class AuthRepository {
    findByEmail(email: string) {
        return db.select().from(usersTable).where(eq(usersTable.email, email));
    };
};