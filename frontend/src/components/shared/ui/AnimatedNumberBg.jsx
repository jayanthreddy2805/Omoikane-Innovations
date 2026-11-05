"use client";
import React, { useEffect, useRef } from "react";

export function AnimatedNumberBg({ className = "", style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let startTime = performance.now();

    const renderLoop = (time) => {
      if (!containerRef.current) return;
      const t = (time - startTime) / 1000;
      
      const ph = t * 0.60;
      const amt = 0.20;
      const dir = 1;
      const spin = ph * dir;
      // Exact calculation based on prompt instructions to avoid snapping
      const angle = 159 + spin * 60 * amt;

      const bgString = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.050'/></svg>"), radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.4) 100%), conic-gradient(from ${angle}deg at 46% 55%, #2E2E2E 0%, #1E1E1E 50%)`;

      containerRef.current.style.backgroundImage = bgString;
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#2E2E2E",
        backgroundSize: "120px 120px, auto, auto",
        backgroundBlendMode: "overlay, normal, normal",
        zIndex: -1,
        pointerEvents: "none",
        ...style
      }}
    />
  );
}
