/**
 * Production Lightweight Structured Logger & Correlation Engine
 * Outputs sanitized, structured JSON log events for observability & auditing.
 * Strictly redacts passwords, session cookies, auth tokens, and secrets.
 */

import crypto from 'crypto';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

export interface StructuredLogEvent {
  timestamp: string;
  level: LogLevel;
  correlationId: string;
  category: string;
  message: string;
  method?: string;
  route?: string;
  statusCode?: number;
  durationMs?: number;
  errorClassification?: string;
  details?: Record<string, unknown>;
}

const REDACTED_KEYS = [
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'session',
  'csrf',
  'key',
  'credential',
];

export function sanitizeDetails(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeDetails);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const isSensitive = REDACTED_KEYS.some((s) => key.toLowerCase().includes(s));
    if (isSensitive) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeDetails(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function generateCorrelationId(incomingHeader?: string | null): string {
  if (incomingHeader && incomingHeader.trim().length > 0) {
    return incomingHeader.trim();
  }
  return `req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export const logger = {
  info: (category: string, message: string, meta: Partial<StructuredLogEvent> = {}) => {
    logger.log('INFO', category, message, meta);
  },

  warn: (category: string, message: string, meta: Partial<StructuredLogEvent> = {}) => {
    logger.log('WARN', category, message, meta);
  },

  error: (category: string, message: string, meta: Partial<StructuredLogEvent> = {}) => {
    logger.log('ERROR', category, message, meta);
  },

  audit: (category: string, message: string, meta: Partial<StructuredLogEvent> = {}) => {
    logger.log('AUDIT', category, message, meta);
  },

  log: (level: LogLevel, category: string, message: string, meta: Partial<StructuredLogEvent> = {}) => {
    const event: StructuredLogEvent = {
      timestamp: new Date().toISOString(),
      level,
      correlationId: meta.correlationId || generateCorrelationId(),
      category,
      message,
      method: meta.method,
      route: meta.route,
      statusCode: meta.statusCode,
      durationMs: meta.durationMs,
      errorClassification: meta.errorClassification,
      details: meta.details ? (sanitizeDetails(meta.details) as Record<string, unknown>) : undefined,
    };

    const serialized = JSON.stringify(event);
    if (level === 'ERROR') {
      console.error(serialized);
    } else if (level === 'WARN') {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  },
};
