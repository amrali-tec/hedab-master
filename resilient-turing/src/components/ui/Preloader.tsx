"use client";

import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Start fade out after 800ms on client mount
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 800);

    // Completely unmount preloader after 1600ms
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 1600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  // Hydration-safe guard: Do not render full-screen overlay during SSR or after completion
  if (!mounted || !show) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center bg-[#070B13] transition-opacity duration-700 ease-out ${
        fade ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Background Hexagon Network */}
      <div className="absolute inset-0 engineering-pattern opacity-[0.06] pointer-events-none" />

      {/* Blueprint Drawing Wrapper */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        <svg viewBox="0 0 400 160" className="w-72 md:w-96 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Engineering blueprint background axes */}
          <line x1="50" y1="10" x2="50" y2="130" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1="130" y1="10" x2="130" y2="130" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1="210" y1="10" x2="210" y2="130" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1="290" y1="10" x2="290" y2="130" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1="370" y1="10" x2="370" y2="130" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />
          
          <line x1="20" y1="20" x2="380" y2="20" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1="20" y1="70" x2="380" y2="70" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />
          <line x1="20" y1="120" x2="380" y2="120" stroke="#00B0F0" strokeOpacity="0.08" strokeDasharray="3 3" />

          {/* Blueprint Structural Towers drawing path */}
          <path 
            className="blueprint-path" 
            d="M 50 120 L 50 40 L 90 20 L 130 40 L 130 120 M 130 120 L 170 120 L 170 10 L 210 30 L 250 10 L 250 120 M 250 120 L 290 120 L 290 60 L 330 40 L 370 60 L 370 120" 
            stroke="#00B0F0" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Diagonal architectural guidelines */}
          <line x1="90" y1="20" x2="170" y2="120" stroke="#00B0F0" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="210" y1="30" x2="290" y2="120" stroke="#00B0F0" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="4 4" />

          {/* GULF HILLS / هضاب الخليج text layout */}
          <text 
            x="200" 
            y="150" 
            textAnchor="middle" 
            fill="#F8FAFC" 
            fontFamily="system-ui, -apple-system, sans-serif" 
            fontSize="11" 
            fontWeight="900" 
            letterSpacing="6"
            className="logo-text-animated opacity-0"
          >
            GULF HILLS | هضاب الخليج
          </text>
        </svg>
      </div>
    </div>
  );
}
