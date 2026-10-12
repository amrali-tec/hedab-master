import React, { Suspense } from 'react';
import { useParams, useLocation } from 'react-router-dom';

/**
 * RouteAdapter: Bridges React Router params with page components.
 * Provides active locale and passes props synchronously with Suspense fallback.
 */
export function withRouteParams<P extends object>(
  Component: React.ComponentType<any>
): React.FC<P> {
  return function WrappedRoute(props: P) {
    const routerParams = useParams();
    const location = useLocation();

    // Determine locale from URL parameter or pathname prefix
    let locale: 'ar' | 'en' = 'ar';
    if (routerParams.locale === 'en' || location.pathname.startsWith('/en')) {
      locale = 'en';
    }

    return (
      <Suspense fallback={<div className="min-h-[40vh] w-full bg-transparent" />}>
        <Component
          {...props}
          locale={locale}
        />
      </Suspense>
    );
  };
}
