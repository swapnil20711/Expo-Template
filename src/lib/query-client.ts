import { QueryClient } from '@tanstack/react-query';

/**
 * Shared TanStack Query client for server state. Tune defaults here; always prefer
 * `useQuery`/`useMutation` over storing fetched data in Zustand.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
