import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(150),

    password: z.string().min(1, "Password is required.").max(128),
  }),
});
