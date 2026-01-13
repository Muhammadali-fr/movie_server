import { Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from 'src/db/drizzle';
import { usersTable } from "src/db/schema";

// interfaces 
import { IGoogleUser, IUser } from "./types/user-type";


@Injectable()
export class AuthRepositoryService {
    findByEmail(email: string) {
        return db.select().from(usersTable).where(eq(usersTable.email, email));
    };

    createUser(user: IUser) {
        return db.insert(usersTable).values({
            name: user.name,
            email: user.email,
        }).returning();
    };

    createGoogleUser(user: IGoogleUser) {
        return db.insert(usersTable).values({
            name: user.name,
            email: user.email,
            avatar: user.email,
            googleId: user.googleId,
            provider: user.provider,
        }).returning();
    };
};