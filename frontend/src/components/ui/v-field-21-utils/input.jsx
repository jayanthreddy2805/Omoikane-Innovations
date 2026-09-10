// Styled Input component — supports type="file" with dark themed styling
"use client";

import * as React from "react";
import styles from "./input.module.css";

export const Input = React.forwardRef(function Input(
  { type = "text", className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`${styles.input} ${type === "file" ? styles.fileInput : ""} ${className}`}
      {...props}
    />
  );
});
