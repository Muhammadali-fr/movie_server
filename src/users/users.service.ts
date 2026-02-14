import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';

const USERNAME_RE = /^[a-z0-9._]{3,30}$/;

@Injectable()
export class UsersService {
    async usernameAvailable(raw: string) {
        const username = (raw ?? "").trim();

        if (!USERNAME_RE.test(username)) {
            return { available: false, reason: "invalid username" };
        };

        const existing = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
            columns: { id: true },
        });

        console.log("existing", existing);

        return { available: !existing };
    };

    async setUsername(userId: string, raw: string) {
        const username = (raw ?? "").trim();

        if (!USERNAME_RE.test(username)) {
            throw new BadRequestException("Invalid username. Use lowercase a-z, 0-9, . and _ (3–30 chars).");
        };

        const taken = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
            columns: { id: true },
        });

        console.log("taken", taken);

        if (taken && taken.id !== userId) {
            throw new ConflictException("Username already taken.");
        };

        await db.update(usersTable).set({ username }).where(eq(usersTable.id, userId));

        return { ok: true, username };
    };

    async findAll() {
        return await db.select().from(usersTable);
        // return { message: "Hello world!!!" }
    };

    async deleteAll() {
        await db.delete(usersTable);
    };


};
