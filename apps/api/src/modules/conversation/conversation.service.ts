import { ApiError } from "@/errors/ApiError";
import { CreateConversationInput } from "./schemas/conversation.schema";
import { ConversationRepository } from "./converstion.repository";

export class ConversationService {

  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async createConversation(
    currentUserId: string,
    data: CreateConversationInput,
  ) {

    const participantIds = [
      currentUserId,
      ...data.participantIds,
    ];

    const uniqueParticipants = [...new Set(participantIds)];

    // DIRECT CHAT

    if (!data.isGroup) {

      if (uniqueParticipants.length !== 2) {
        throw new ApiError(
          400,
          "Direct conversation must contain exactly 2 participants",
        );
      }

      const existingConversation =
        await this.conversationRepository.findDirectConversation(
          uniqueParticipants,
        );

      if (existingConversation) {
        return existingConversation;
      }

    }

    // GROUP VALIDATION

    if (data.isGroup) {

      if (!data.name?.trim()) {
        throw new ApiError(
          400,
          "Group name is required",
        );
      }

      if (uniqueParticipants.length < 3) {
        throw new ApiError(
          400,
          "Group must contain at least 3 users",
        );
      }

    }

    const conversation =
      await this.conversationRepository.createConversation({
        name: data.name,
        isGroup: data.isGroup,
      });

    await this.conversationRepository.addParticipants({
      conversationId: conversation.id,
      participantIds: uniqueParticipants,
    });

    return this.conversationRepository.getConversationById(
      conversation.id,
    );

  }

  async getUserConversations(userId: string) {

    return this.conversationRepository.getUserConversations(userId);

  }

  async getConversationById(conversationId: string) {

    const conversation =
      await this.conversationRepository.getConversationById(
        conversationId,
      );

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    return conversation;

  }

}