"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

interface ScrollProviderProps {
  children: React.ReactNode;
}

/**
 * ScrollProvider
 * Integrates Lenis Smooth Scrolling with GSAP ScrollTrigger.
 * Tuned for 60fps+ responsiveness, natural wheel friction, and snappier parallax feel.
 */
export function ScrollProvider({ children }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Accessibility: Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('Lenis Smooth Scroll disabled due to OS prefers-reduced-motion settings.');
      return;
    }

    // Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll with premium snappy parameters
    const lenis = new Lenis({
      duration: 1.0, // Swifter scrolling response
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, // Highly responsive, standard speed
      touchMultiplier: 1.2, // Balanced touch speed
    });

    lenisRef.current = lenis;

    // Connect Lenis scrolling events to GSAP ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update);

    // Sync Lenis frame updates to GSAP ticker for 60fps+ synchronized animations
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Lifecycle Cleanup
    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
