"use client";
import { MeshGradient } from "@paper-design/shaders-react";

export default function DeferredMeshGradient({
  colors,
  speed,
  style,
}: {
  colors: string[];
  speed: number;
  style: React.CSSProperties;
}) {
  return <MeshGradient colors={colors} speed={speed} style={style} />;
}
