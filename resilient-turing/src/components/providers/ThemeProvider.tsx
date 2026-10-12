"use client";

import React from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

// Suppress false positive React 19 script tag warning for next-themes during development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' && 
      (args[0].includes('Encountered a script tag') || args[0].includes('Extra attributes from the server'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider Component
 * Handles the dark/light/system theme toggles on the client.
 * Using attribute="class" to inject class="dark" in html element.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true} 
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemeProvider>
  );
}

