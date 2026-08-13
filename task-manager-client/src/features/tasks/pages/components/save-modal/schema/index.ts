import z from "zod";

const SaveTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(3, 'Description must be at least 3 characters')
    .max(400, 'Description must be less than 400 characters'),
  userId: z.string().optional(),
});

export default SaveTaskSchema;
