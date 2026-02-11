import { timestamp, pgEnum, text, uuid, pgTable, uniqueIndex, index } from "drizzle-orm/pg-core";

export const ProviderEnum = pgEnum("provider", ["email", "google"]);

export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    username: text("username"),
    avatar: text("avatar"),
    provider: ProviderEnum("provider").notNull().default('email'),
    googleId: text("google_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
    usernameUnique: uniqueIndex("users_username_unique").on(t.username),
    googleIdUnique: uniqueIndex("users_google_id_unique").on(t.googleId),
    emailIdx: index("users_email_idx").on(t.email),
}));

export const moviesTable = pgTable("movies", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    moviePoster: text("movie_poster"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => ({
    userIdIdx: index("movies_unique_id_idx").on(t.userId)
}));