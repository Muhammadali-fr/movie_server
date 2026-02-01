import { timestamp, pgEnum, text, uuid, pgTable } from "drizzle-orm/pg-core";

export const ProviderEnum = pgEnum("provider", ["email", "google"]);

export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    avatar: text("avatar"),
    provider: ProviderEnum("provider").notNull().default('email'),
    googleId: text("googleId"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export const moviesTable = pgTable("movies", {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid("userId")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    moviePoster: text("moviePoster"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
});