"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function GeometricBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.01;
      const moveY = (clientY - window.innerHeight / 2) * 0.01;

      gsap.to(bgRef.current, {
        x: moveX,
        y: moveY,
        duration: 1,
        ease: "power1.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={bgRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent overflow-hidden"
    >
      <div className="engineering-pattern w-full h-full" />
    </div>
  );
}