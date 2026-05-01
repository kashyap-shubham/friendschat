import { z } from "zod";

export const updateUserSchema = z.object({

  body: z.object({

    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .trim()
      .optional(),

    image: z
      .url("Image must be a valid URL")
      .nullable()
      .optional()

  })

});