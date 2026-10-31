"use client";

import { useEffect, useRef, useState } from "react";
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: "200px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={triggerRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true">
      {visible ? <MeshGradient colors={colors} speed={speed} style={style} /> : null}
    </div>
  );
}
