import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),

  due_date: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Invalid date format"
    ),

  progress: z
    .number()
    .min(0)
    .max(100)
    .optional(),

  project_id: z
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
});

export const updateTaskSchema = createTaskSchema.partial();