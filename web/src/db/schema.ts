import { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: varchar().notNull().primaryKey().$defaultFn(() => createId()),
  title: varchar().notNull(),
  completed: boolean().notNull().default(false),
});
export type todosTableType = typeof todosTable.$inferInsert;