import { relations } from "drizzle-orm";
import { usersTable, moviesTable } from "./schema";

export const usersRelations = relations(usersTable, ({ many }) => ({
  movies: many(moviesTable),
}));

export const moviesRelations = relations(moviesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [moviesTable.userId],
    references: [usersTable.id],
  }),
}));
