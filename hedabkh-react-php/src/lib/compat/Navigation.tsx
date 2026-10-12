import { useNavigate, useLocation, useSearchParams as useRouterSearchParams, useParams as useRouterParams } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    prefetch: () => {},
  };
}

export function usePathname(): string {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const [searchParams] = useRouterSearchParams();
  return searchParams;
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  return useRouterParams() as T;
}

export function redirect(url: string): never {
  window.location.href = url;
  throw new Error(`Redirecting to ${url}`);
}

export function notFound(): never {
  throw new Error('404 Not Found');
}
