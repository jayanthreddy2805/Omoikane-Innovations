"use client";
import { useEffect, useRef } from "react";

const controls = "button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex='-1'])";

export default function AccessibleDialog({ children, onClose, labelledBy, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    (ref.current?.querySelector(controls) || ref.current)?.focus();
    return () => { document.body.style.overflow = overflow; opener?.focus?.(); };
  }, []);
  const onKeyDown = (event) => {
    if (event.key === "Escape") { event.preventDefault(); onClose(); }
    if (event.key !== "Tab") return;
    const items = [...ref.current.querySelectorAll(controls)].filter(element => element.getClientRects().length);
    const first = items[0], last = items.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={labelledBy} tabIndex={-1}
    className={className} onKeyDown={onKeyDown} onClick={event => event.stopPropagation()}>{children}</div>;
}
