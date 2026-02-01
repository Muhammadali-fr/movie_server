import { relations } from "drizzle-orm";
import { usersTable, moviesTable } from "./schema.js";

export const usersRelatoins = relations(usersTable, ({ many }) => ({
    movies: many(moviesTable),
}));

export const moviesRelatoins = relations(moviesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [moviesTable.userId],
        references: [usersTable.id]
    }),
}));