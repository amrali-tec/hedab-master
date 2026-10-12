/**
 * Central HTTP API Client
 * Production-ready fetch client for PHP REST API communication.
 */

import { ApiResponse, ApiErrorPayload } from '../types/apiContracts';

const DEFAULT_BASE_URL = '/api/v1';

export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) {
    return (window as any).__API_BASE_URL__;
  }
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  timeoutMs?: number;
}

export class ApiError extends Error {
  public code: string;
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number = 500, code: string = 'ERROR', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Execute HTTP request with timeout, JSON parsing, and standard error normalization.
 */
export async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, timeoutMs = 15000, ...fetchOptions } = options;
  const baseUrl = getApiBaseUrl();

  // Normalize endpoint URL
  let fullUrl: string;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    fullUrl = endpoint;
  } else {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // If endpoint already contains /api/v1 and baseUrl ends with /api/v1, avoid duplication
    if (cleanEndpoint.startsWith('/api/v1') && baseUrl.endsWith('/api/v1')) {
      fullUrl = cleanEndpoint;
    } else {
      fullUrl = `${baseUrl}${cleanEndpoint}`;
    }
  }

  // Append query params if provided
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Prevent browser caching by appending timestamp query on GET/HEAD requests
  const method = (fetchOptions.method || 'GET').toUpperCase();
  if (method === 'GET' || method === 'HEAD') {
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + `_t=${Date.now()}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      cache: 'no-store', // ⚡ Disable browser fetch caching completely
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...(fetchOptions.headers || {}),
      },
      credentials: 'include', // 🍪 Cookies: Preserved and allowed normally (sessions & tokens)
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let parsedBody: any = null;

    if (contentType.includes('application/json')) {
      parsedBody = await response.json().catch(() => null);
    } else {
      const text = await response.text();
      try {
        parsedBody = JSON.parse(text);
      } catch {
        parsedBody = text;
      }
    }

    if (!response.ok) {
      const errorObj: ApiErrorPayload = parsedBody?.error || {
        code: `HTTP_${response.status}`,
        message: parsedBody?.message || `Request failed with status ${response.status}`,
      };

      return {
        success: false,
        data: null as unknown as T,
        error: errorObj,
        meta: parsedBody?.meta,
      };
    }

    // Standard backend envelope: { success: true, data: ..., meta: ... }
    if (parsedBody && typeof parsedBody === 'object' && 'success' in parsedBody) {
      return parsedBody as ApiResponse<T>;
    }

    return {
      success: true,
      data: parsedBody as T,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        success: false,
        data: null as unknown as T,
        error: {
          code: 'TIMEOUT',
          message: 'Request timed out. Please check your network connection.',
        },
      };
    }

    const message = err instanceof Error ? err.message : 'Network error encountered.';
    return {
      success: false,
      data: null as unknown as T,
      error: {
        code: 'NETWORK_ERROR',
        message,
      },
    };
  }
}

/**
 * Convenience methods for HTTP verbs.
 */
export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined | null>, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'GET', params, ...options }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};
