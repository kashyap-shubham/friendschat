import { prisma } from "@/lib/prisma";
import { CreateConversationInput } from "./schemas/conversation.schema";

type CreateConversationRepositoryInput = Omit<
  CreateConversationInput,
  "participantIds"
>;

type AddParticipantsInput = {
  conversationId: string;
  participantIds: string[];
};

export class ConversationRepository {

  async findDirectConversation(participantIds: string[]) {

    return prisma.conversation.findFirst({

      where: {
        isGroup: false,

        participants: {
          every: {
            userId: {
              in: participantIds,
            },
          },
        },
      },

      include: {
        participants: true,
      },

    });

  }

  async createConversation(data: CreateConversationRepositoryInput) {

    return prisma.conversation.create({

      data: {
        name: data.name,
        isGroup: data.isGroup ?? false,
      },

    });

  }

  async addParticipants(data: AddParticipantsInput) {

    return prisma.participant.createMany({

      data: data.participantIds.map((participantId) => ({
        userId: participantId,
        conversationId: data.conversationId,
      })),

      skipDuplicates: true,

    });

  }

  async getUserConversations(userId: string) {

    return prisma.conversation.findMany({

      where: {
        participants: {
          some: {
            userId,
          },
        },
      },

      include: {
        participants: {
          include: {
            user: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },

          take: 1,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },

    });

  }

  async getConversationById(conversationId: string) {

    return prisma.conversation.findUnique({

      where: {
        id: conversationId,
      },

      include: {
        participants: {
          include: {
            user: true,
          },
        },

        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },

    });

  }

}

export const conversationRepository = new ConversationRepository();