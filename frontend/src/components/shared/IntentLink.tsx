"use client";

import { useState, type ComponentProps } from "react";
import NextLink from "next/link";

// Prepare the destination when a person points to or focuses a link, rather
// than downloading every linked route's forms and media on the first screen.
export default function IntentLink({ onMouseEnter, onFocus, prefetch, ...props }: ComponentProps<typeof NextLink>) {
  const [intent, setIntent] = useState(false);
  return <NextLink
    {...props}
    prefetch={prefetch === undefined ? (intent ? null : false) : prefetch}
    onMouseEnter={event => { setIntent(true); onMouseEnter?.(event); }}
    onFocus={event => { setIntent(true); onFocus?.(event); }}
  />;
}
