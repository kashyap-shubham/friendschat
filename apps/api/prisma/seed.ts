import { env } from "@/config/env";
import { PrismaClient, MessageType } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = env.DATABASE_URL;

const adapter = new PrismaPg(new pg.Pool({ connectionString }));

const prisma = new PrismaClient({
  adapter,
});

async function seedDatabase() {
  try {
    console.log("Starting database seed...");

    await prisma.$transaction(async (tx) => {

      // USERS
      console.log("Seeding users...");

      const users = [
        {
          id: "11111111-1111-1111-1111-111111111111",
          email: "shubham@gmail.com",
          name: "Shubham",
          image: null,
          googleId: "google_shubham",
        },
        {
          id: "22222222-2222-2222-2222-222222222222",
          email: "rahul@gmail.com",
          name: "Rahul",
          image: null,
          googleId: "google_rahul",
        },
      ];

      for (const user of users) {
        await tx.user.upsert({
          where: { email: user.email },
          update: {},
          create: user,
        });
      }

      console.log("Users seeded");

      // CONVERSATIONS
      console.log("Seeding conversations...");

      const conversations = [
        {
          id: "33333333-3333-3333-3333-333333333333",
          name: null,
          isGroup: false,
        },
        {
          id: "44444444-4444-4444-4444-444444444444",
          name: "College Friends",
          isGroup: true,
        },
      ];

      for (const conversation of conversations) {
        await tx.conversation.upsert({
          where: { id: conversation.id },
          update: {},
          create: conversation,
        });
      }

      console.log("Conversations seeded");

      // PARTICIPANTS
      console.log("Seeding participants...");

      const participants = [
        {
          userId: "11111111-1111-1111-1111-111111111111",
          conversationId: "33333333-3333-3333-3333-333333333333",
        },
        {
          userId: "22222222-2222-2222-2222-222222222222",
          conversationId: "33333333-3333-3333-3333-333333333333",
        },
        {
          userId: "11111111-1111-1111-1111-111111111111",
          conversationId: "44444444-4444-4444-4444-444444444444",
        },
        {
          userId: "22222222-2222-2222-2222-222222222222",
          conversationId: "44444444-4444-4444-4444-444444444444",
        },
      ];

      for (const participant of participants) {
        await tx.participant.upsert({
          where: {
            userId_conversationId: {
              userId: participant.userId,
              conversationId: participant.conversationId,
            },
          },
          update: {},
          create: participant,
        });
      }

      console.log("Participants seeded");

      // MESSAGES
      console.log("Seeding messages...");

      const messages = [
        {
          id: "55555555-5555-5555-5555-555555555555",
          content: "Hey Rahul 👋",
          messageType: MessageType.TEXT,
          mediaUrl: null,
          mimeType: null,
          fileSize: null,
          senderId: "11111111-1111-1111-1111-111111111111",
          conversationId: "33333333-3333-3333-3333-333333333333",
        },
        {
          id: "66666666-6666-6666-6666-666666666666",
          content: "Hello Shubham!",
          messageType: MessageType.TEXT,
          mediaUrl: null,
          mimeType: null,
          fileSize: null,
          senderId: "22222222-2222-2222-2222-222222222222",
          conversationId: "33333333-3333-3333-3333-333333333333",
        },
        {
          id: "77777777-7777-7777-7777-777777777777",
          content: "Check this image",
          messageType: MessageType.IMAGE,
          mediaUrl: "https://cdn.friendschat.com/images/demo-image.jpg",
          mimeType: "image/jpeg",
          fileSize: 204800,
          senderId: "11111111-1111-1111-1111-111111111111",
          conversationId: "44444444-4444-4444-4444-444444444444",
        },
        {
          id: "88888888-8888-8888-8888-888888888888",
          content: "Sharing system design PDF",
          messageType: MessageType.FILE,
          mediaUrl: "https://cdn.friendschat.com/files/system-design.pdf",
          mimeType: "application/pdf",
          fileSize: 1048576,
          senderId: "22222222-2222-2222-2222-222222222222",
          conversationId: "44444444-4444-4444-4444-444444444444",
        },
      ];

      for (const message of messages) {
        await tx.message.upsert({
          where: { id: message.id },
          update: {},
          create: message,
        });
      }

      console.log("Messages seeded");

      // SESSIONS
      console.log("Seeding sessions...");

      const sessions = [
        {
          id: "99999999-9999-9999-9999-999999999999",
          userId: "11111111-1111-1111-1111-111111111111",
          sessionId: "session_shubham_1",
          userAgent: "Chrome on MacOS",
          ip: "127.0.0.1",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
          userId: "22222222-2222-2222-2222-222222222222",
          sessionId: "session_rahul_1",
          userAgent: "Safari on iPhone",
          ip: "127.0.0.1",
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ];

      for (const session of sessions) {
        await tx.session.upsert({
          where: { sessionId: session.sessionId },
          update: {},
          create: session,
        });
      }

      console.log("Sessions seeded");

    });

    console.log("Database seeding completed");

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();