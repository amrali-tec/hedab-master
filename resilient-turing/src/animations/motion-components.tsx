"use client";

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Hook to detect the user's OS preference for reduced motion.
 * Ensures compliance with Lighthouse and web accessibility guidelines (WCAG).
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return reduced;
}

// ==========================================
// 1. <RevealText>
// ==========================================
interface RevealTextProps {
  children: string;
  className?: string;
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

/**
 * RevealText Component
 * Wraps text elements to perform a premium mask reveal effect.
 * Speed-optimized: duration 0.5s with power4.out for a snappy entrance.
 */
export function RevealText({ children, className = '', tagName = 'h2' }: RevealTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const Tag = tagName;

  useEffect(() => {
    if (prefersReduced || typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const inner = innerRef.current;
    if (!inner) return;

    const anim = gsap.fromTo(
      inner,
      { y: '100%' },
      {
        y: '0%',
        duration: 0.5, // Accelerated from 0.9s
        ease: 'power4.out', // Snappier ease-out
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 92%', // Triggers slightly earlier
          toggleActions: 'play none none none',
        },
      }
    );

    return () => {
      anim.kill();
    };
  }, [prefersReduced, children]);

  return (
    <Tag
      ref={containerRef as any}
      className={`relative overflow-hidden inline-block ${className}`}
      style={{ verticalAlign: 'bottom' }}
    >
      <span
        ref={innerRef}
        className="inline-block"
        style={{ transform: prefersReduced ? 'none' : 'translateY(100%)' }}
      >
        {children}
      </span>
    </Tag>
  );
}

// ==========================================
// 2. <HoverLift>
// ==========================================
interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
  liftAmount?: number;
  scaleAmount?: number;
}

/**
 * HoverLift Component
 * Enhances elements with a premium, responsive lifting and scaling animation.
 * Speed-optimized: duration 0.3s with power3.out.
 */
export function HoverLift({ children, className = '', liftAmount = -6, scaleAmount = 1.02 }: HoverLiftProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const handleMouseEnter = () => {
    if (prefersReduced || typeof window === 'undefined') return;
    gsap.to(containerRef.current, {
      y: liftAmount,
      scale: scaleAmount,
      duration: 0.3, // Accelerated from 0.4s
      ease: 'power3.out',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
    });
  };

  const handleMouseLeave = () => {
    if (prefersReduced || typeof window === 'undefined') return;
    gsap.to(containerRef.current, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power3.out',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.01)',
    });
  };

  return (
    <div
      ref={containerRef}
      className={`transition-shadow duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: prefersReduced ? 'auto' : 'transform' }}
    >
      {children}
    </div>
  );
}

// ==========================================
// 3. <MagneticButton>
// ==========================================
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  range?: number;
  strength?: number;
}

/**
 * MagneticButton Component
 * Drag-optimized: duration 0.2s with power3.out.
 * Snap-optimized: duration 0.4s with back.out(1.8) for an organic elastic recoil.
 */
export function MagneticButton({ children, className = '', range = 60, strength = 0.3 }: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || typeof window === 'undefined') return;
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const distance = Math.sqrt(x * x + y * y);

    if (distance < range) {
      gsap.to(inner, {
        x: x * strength,
        y: y * strength,
        duration: 0.2, // Snappier drag tracking
        ease: 'power3.out',
      });
    } else {
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.4, // Fast elastic snap-back
        ease: 'back.out(1.8)',
      });
    }
  };

  const handleMouseLeave = () => {
    if (prefersReduced || typeof window === 'undefined') return;
    const inner = innerRef.current;
    if (!inner) return;

    gsap.to(inner, {
      x: 0,
      y: 0,
      duration: 0.4, // Fast elastic snap-back
      ease: 'back.out(1.8)',
    });
  };

  return (
    <div
      ref={containerRef}
      className={`inline-block cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: prefersReduced ? '0' : '15px',
        margin: prefersReduced ? '0' : '-15px',
      }}
    >
      <div ref={innerRef} className="inline-block">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// 4. <CounterAnimation>
// ==========================================
interface CounterAnimationProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
}

/**
 * CounterAnimation Component
 * Speed-optimized: default duration 1.2s for swift count-up on scroll.
 */
export function CounterAnimation({ value, duration = 1.2, decimals, className = '' }: CounterAnimationProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [displayVal, setDisplayVal] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  const targetDecimals = decimals !== undefined
    ? decimals
    : (value.toString().split('.')[1] || '').length;

  useEffect(() => {
    if (prefersReduced) {
      setDisplayVal(value);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const el = elementRef.current;
    if (!el) return;

    const countObj = { val: 0 };

    const anim = gsap.to(countObj, {
      val: value,
      duration: duration,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 95%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        setDisplayVal(Number(countObj.val.toFixed(targetDecimals)));
      },
    });

    return () => {
      anim.kill();
    };
  }, [value, duration, targetDecimals, prefersReduced]);

  return (
    <span ref={elementRef} className={`inline-block tabular-nums ${className}`}>
      {prefersReduced ? value : displayVal.toFixed(targetDecimals)}
    </span>
  );
}
