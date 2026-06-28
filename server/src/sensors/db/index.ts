import z from "zod";
import { TaskId, TaskSchema, UserId } from "../../schemas.js";
import { sql } from "./_config.js";

class Store {
  async getTasks(input: { userId: UserId }) {
    const rows = await sql`
      SELECT task_id, user_id, title, done, created_at
      FROM tasks
      WHERE user_id = ${input.userId}
      ORDER BY created_at DESC, task_id DESC
      LIMIT 100
    `;

    return z.array(TaskSchema).parse(rows);
  }

  async createTask(input: { userId: UserId; title: string }) {
    const rows = await sql`
      INSERT INTO tasks (title, user_id)
      VALUES (${input.title}, ${input.userId})
      RETURNING *
    `;
    return TaskSchema.parse(rows[0]);
  }

  async setDone(input: { id: TaskId; done: boolean }) {
    const rows = await sql`
      UPDATE tasks
      SET done = ${input.done}
      WHERE task_id = ${input.id}
      RETURNING *
    `;

    return TaskSchema.parse(rows[0]);
  }
}

export const db = new Store();
