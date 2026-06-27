import { z } from 'zod';

/**
 * Public environment variables. Anything the client reads must be prefixed `EXPO_PUBLIC_` and
 * defined in `.env` (see `.env.example`). Auth is optional so the template runs before you add a
 * Clerk key — `isAuthConfigured` gates the Clerk provider and auth UI.
 */
const schema = z.object({
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

const parsed = schema.safeParse({
  EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
});

if (!parsed.success) {
  console.warn('[env] Invalid environment variables:', parsed.error.issues);
}

export const env = {
  clerkPublishableKey: parsed.success ? parsed.data.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY : undefined,
};

export const isAuthConfigured = Boolean(env.clerkPublishableKey);
