import z from "zod";

export const UserIdSchema = z.number().int().positive().brand("user id");
export type UserId = z.infer<typeof UserIdSchema>;

export const TaskIdSchema = z.number().int().positive().brand("task id");
export type TaskId = z.infer<typeof TaskIdSchema>;

export const TaskSchema = z.object({
  taskId: TaskIdSchema,
  userId: UserIdSchema,
  title: z.string(),
  done: z.boolean(),
  createdAt: z.date(),
});
