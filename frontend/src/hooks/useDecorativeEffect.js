"use client";

import { useEffect, useState } from "react";

// Decorative work runs only near the viewport, in a visible tab, with motion enabled.
export default function useDecorativeEffect(ref, rootMargin = "240px") {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nearViewport = false;
    const update = () => setActive(nearViewport && !motion.matches && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      nearViewport = entry.isIntersecting;
      update();
    }, { rootMargin });

    observer.observe(element);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [ref, rootMargin]);

  return active;
}
