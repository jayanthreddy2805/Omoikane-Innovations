import styles from "./OmoikabeGridHero.module.css";

type FileAnimationProps = {
  className?: string;
  variant?: "document" | "pdf";
};

/** Floating document illustration used by the hero's dotted-route animation. */
export function FileAnimation({ className = "", variant = "document" }: FileAnimationProps) {
  const isPdf = variant === "pdf";
  return (
    <div
      className={`${styles.fileObject} ${isPdf ? styles.fileObjectPdf : styles.fileObjectPlain} ${className}`}
      aria-hidden="true"
    >
      <svg className={styles.fileSvg} viewBox="0 0 110 130" fill="none">
        <path d="M22 10.5H66L91 35V119.5H22V10.5Z" fill="#F7F5EF" stroke="#242622" strokeWidth="1.4" />
        <path d="M66 10.5V35H91" fill="#E9E6DD" stroke="#242622" strokeWidth="1.4" />
        <path d="M33 52H78M33 62H72M33 72H76M33 82H60" stroke="#77796F" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M33 97H52" stroke="#C5C6BA" strokeWidth="1.6" strokeLinecap="round" />
        {isPdf && (
          <g>
            <rect x="63" y="82" width="37" height="20" rx="1" fill="#151614" />
            <text x="81.5" y="95.4" fill="#F7F5EF" fontSize="9" fontWeight="700" textAnchor="middle" letterSpacing="1">PDF</text>
          </g>
        )}
      </svg>
      <span className={styles.fileShadow} />
    </div>
  );
}
