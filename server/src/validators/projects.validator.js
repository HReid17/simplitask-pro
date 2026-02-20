import { z } from "zod";

const statusEnum = z.enum(["Complete", "In Progress", "Not Started"]);

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),

  scheduled_completion: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val || val.trim() === "") return null;
      return val;
    })
    .refine(
      (val) => val === null || !isNaN(Date.parse(val)),
      "Invalid date format"
    ),

  status: statusEnum.default("Not Started"),
});

export const updateProjectSchema = createProjectSchema.partial();
