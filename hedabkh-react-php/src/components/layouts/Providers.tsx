"use client";

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../providers/ThemeProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers Wrapper Component
 * Configures the QueryClient (TanStack Query) and our custom ThemeProvider on the client side.
 * Avoids SSR hydration issues and makes contexts available globally.
 */
export function Providers({ children }: ProvidersProps) {
  // Use state to guarantee QueryClient is created only once per browser session
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // Cache for 5 minutes
            refetchOnWindowFocus: false, // Prevent aggressive background refetching
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default Providers;
