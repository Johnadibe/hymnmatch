import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30, // survive tab switches and backgrounding
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // cached tab data renders without a refetch
      refetchOnReconnect: 'always',
      networkMode: 'offlineFirst',
    },
  },
})
