import { env } from "@/config/env";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";


const  connectionString = env.DATABASE_URL;

const adapter = new PrismaPg(new pg.Pool({
    connectionString
}));


const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};


export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});


if (env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}