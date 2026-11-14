"use client";

import NextImage from "next/image";
import { useCallback, useState } from "react";

function ImageWithLoadState({ native = false, style, onLoad, onError, ...props }) {
  const [ready, setReady] = useState(false);
  const cachedPhotoRef = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setReady(true);
  }, []);
  const Component = native ? "img" : NextImage;

  return (
    <Component
      {...props}
      {...(native ? { ref: cachedPhotoRef } : {})}
      style={{ ...style, visibility: ready ? style?.visibility : "hidden" }}
      onLoad={(event) => {
        setReady(true);
        onLoad?.(event);
      }}
      onError={(event) => {
        setReady(false);
        onError?.(event);
      }}
    />
  );
}

export default function LoadAwareImage(props) {
  const source = typeof props.src === "string" ? props.src : props.src?.src;
  return <ImageWithLoadState key={source} {...props} />;
}

// Preserve the native img nodes used by the leadership gallery animation.
export function LoadAwarePhoto(props) {
  return <ImageWithLoadState key={props.src} {...props} native />;
}
