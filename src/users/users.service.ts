import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { AwsService } from 'src/aws/aws.service';
import { db } from 'src/db/drizzle';
import { usersTable } from 'src/db/schema';

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const USERNAME_RE = /^[a-z0-9._]{3,30}$/;

@Injectable()
export class UsersService {
    constructor(
        private aws: AwsService
    ) { }

    async usernameAvailable(raw: string) {
        const username = (raw ?? "").trim();

        if (!USERNAME_RE.test(username)) {
            return { available: false, reason: "invalid username" };
        };

        const existing = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
            columns: { id: true },
        });

        return { available: !existing };
    };

    async setUsername(data: { userId: string, username: string, avatar: Express.Multer.File }) {
        const username = (data.username ?? "").trim();

        if (!USERNAME_RE.test(username)) {
            throw new BadRequestException("Invalid username. Use lowercase a-z, 0-9, . and _ (3–30 chars).");
        };

        if (!data.avatar || data.avatar.size === 0) {
            throw new BadRequestException("Profile photo is required.");
        }

        if (!ACCEPTED_TYPES.has(data.avatar.mimetype)) {
            throw new BadRequestException("Only JPG, PNG, or WEBP images are allowed.");
        }

        const taken = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
            columns: { id: true },
        });

        if (taken && taken.id !== data.userId) {
            throw new ConflictException("Username already taken.");
        };

        const { url: avatarUrl } = await this.aws.uploadUserAvatar(data.avatar, data.userId);

        await db
            .update(usersTable)
            .set({ username, avatar: avatarUrl })
            .where(eq(usersTable.id, data.userId));

        return { message: "Username and avatar set successfully" };
    };

    async findAll() {
        return await db.select().from(usersTable);
        // return { message: "Hello world!!!" }
    };

    async deleteAll() {
        await db.delete(usersTable);
    };


};
