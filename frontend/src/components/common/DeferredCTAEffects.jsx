"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import useDecorativeEffect from "@/hooks/useDecorativeEffect";

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then(module => module.MeshGradient),
  { ssr: false },
);

export default function DeferredCTAEffects() {
  const ref = useRef(null);
  const active = useDecorativeEffect(ref);

  return (
    <div ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {active && <>
        <MeshGradient
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, opacity: 0.85, backgroundColor: "#000812" }}
          colors={["#000812", "#0F172A", "#1E293B", "#334155"]}
          speed={0.5}
        />
        <MeshGradient
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 2, opacity: 0.75, backgroundColor: "transparent" }}
          colors={["#000812", "#475569", "#000812"]}
          speed={0.35}
        />
      </>}
    </div>
  );
}
