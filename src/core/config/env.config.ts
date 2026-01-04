import { z } from 'zod';

const envSchema = z.object({
    // Server API
    NEXT_PUBLIC_SERVER_API: z.string().url(),

    // Realtime API
    NEXT_PUBLIC_REALTIME_SERVER_API: z.string().url(),

    // Turn Server
    NEXT_PUBLIC_TURN_USERNAME: z.string().optional(),
    NEXT_PUBLIC_TURN_CREDENTIAL: z.string().optional(),

    // Node Env
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    // Google Client Id:
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
});

// Process env validation
const envProcess = envSchema.safeParse({
    NEXT_PUBLIC_SERVER_API: process.env.NEXT_PUBLIC_SERVER_API,
    NEXT_PUBLIC_REALTIME_SERVER_API:
        process.env.NEXT_PUBLIC_REALTIME_SERVER_API,
    NEXT_PUBLIC_TURN_USERNAME: process.env.NEXT_PUBLIC_TURN_USERNAME,
    NEXT_PUBLIC_TURN_CREDENTIAL: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
});

if (!envProcess.success) {
    console.error(
        '❌ Invalid environment variables:',
        envProcess.error.format()
    );
    throw new Error('Invalid environment variables');
}

export const env = envProcess.data;
