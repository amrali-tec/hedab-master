import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, useRoutes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from './router/routes';
import { CookieConsentBanner } from './components/ui/CookieConsentBanner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // ⚡ Immediate fresh data retrieval on every view
      gcTime: 1000 * 60 * 5, // Short garbage collection
      refetchOnWindowFocus: true, // Auto refetch when tab focused
      retry: (failureCount, error: any) => {
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Scroll to top on route change component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div className="min-h-screen w-full bg-[#070B14]" />}>{element}</Suspense>;
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <CookieConsentBanner />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
