"use client";
import NextImage from "next/image";
// Preserve server-rendered image visibility, including cached and no-script images.
export default function LoadAwareImage({ sizes = '(max-width: 768px) 100vw, 50vw', ...props }) {
  return <NextImage sizes={sizes} {...props} />;
}
export function LoadAwarePhoto({ alt = '', ...props }) {
  return <NextImage alt={alt} width={1200} height={900} sizes="(max-width: 768px) 100vw, 75vw" {...props} />;
}
