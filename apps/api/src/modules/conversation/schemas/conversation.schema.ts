import { z } from "zod";

export const createConversationSchema = z.object({

  body: z.object({

    name: z
      .string()
      .min(2, "Conversation name must be at least 2 characters")
      .max(50, "Conversation name must be less than 50 characters")
      .trim()
      .optional(),

    isGroup: z
      .boolean()
      .optional(),

    participantIds: z
      .array(z.uuid("Invalid participant id"))
      .min(1, "At least one participant is required"),

  })

});

export type CreateConversationInput = z.infer<typeof createConversationSchema>["body"];