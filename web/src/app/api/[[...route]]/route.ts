import db from "@/db";
import { todosTable, todosTableType } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({
    message: "Hello Next.js!",
  });
});

// TODO's
app.get("/todos", async (c) => {
  const todos = await db.query.todosTable.findMany();
  return c.json(todos);
});

app.post("/todos", async (c) => {
  const todo = await c.req.json() as Omit<todosTableType, 'id'>;
  const result = await db
    .insert(todosTable)
    .values(todo)
    .returning();

  if (result.length === 0) {
    return c.json({ error: 'Failed to create todo' }, 500)
  }

  return c.json(result[0]);
});

app.patch("/todos/:id", async (c) => {
  const id = c.req.param('id');
  const partialTodo = await c.req.json() as Partial<todosTableType>;;
  
  // fetch todo with id
  await db.query.todosTable.findFirst({where: eq(todosTable.id, id)});
  const result = await db
    .update(todosTable)
    .set(partialTodo)
    .where(eq(todosTable.id, id))
    .returning();

  if (result.length === 0) {
    return c.json({error: 'Todo not found'}, 404);
  }

  return c.json(result[0]);
});

app.delete("/todos/:id", async(c) => {
  const id = c.req.param('id');

  const result = await db
    .delete(todosTable)
    .where(eq(todosTable.id, id))
    .returning();
  
  if (result.length === 0) {
    return c.json({ error: 'Todo not found' }, 404);
  }
  
  return c.json(result[0])
})




export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
