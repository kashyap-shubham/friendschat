import "dotenv/config";
import { z } from "zod";


const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    PORT: z.coerce.number().default(3001),

    DATABASE_URL: z.string().min(1),

    FRONTEND_URL: z.string().min(1),

    CDN_URL: z.url(),

    GOOGLE_CLIENT_ID: z.string().min(1),

    GOOGLE_CLIENT_SECRET: z.string().min(1),

    GOOGLE_CALLBACK_URL: z.string().min(1),

    SESSION_SECRET: z.string().min(32),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variable");
    console.error(z.treeifyError(parsed.error));
    process.exit(1);
}


export const env = parsed.data;


