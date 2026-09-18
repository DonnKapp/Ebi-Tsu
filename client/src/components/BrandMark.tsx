import type { SVGProps } from "react";

type BrandMarkProps = SVGProps<SVGSVGElement> & {
  compact?: boolean;
};

export function BrandMark({ compact = false, ...props }: BrandMarkProps) {
  return (
    <svg
      aria-label="Ebi Tsū shrimp emblem"
      className={`brand-mark ${compact ? "brand-mark--compact" : ""}`}
      role="img"
      viewBox="0 0 120 120"
      {...props}
    >
      <circle cx="60" cy="60" r="53" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.42" />
      <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.24" />
      <path d="M31 68c6 16 22 25 39 22 15-3 25-14 26-28 1-16-9-28-23-32-16-5-32 1-40 14-5 8-6 16-2 24Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M34 65c14 8 32 9 47 2 7-3 12-8 15-14M36 74c14 6 27 6 39 2" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.9" />
      <path d="M44 38c-3-6-7-11-13-15M51 35c-1-7-1-13-5-20M38 44c-7-3-12-4-18-3" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
      <path d="M83 77c7 2 12 6 17 12M77 85c6 5 8 10 10 16M70 89c1 6 1 11-1 17" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="77" cy="48" r="2.6" fill="currentColor" />
      <path d="M87 47c4 2 6 5 7 9" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup ${compact ? "brand-lockup--compact" : ""}`}>
      <BrandMark compact={compact} />
      <span className="brand-lockup__type">
        <span className="wordmark__latin">Ebi Tsū</span>
        <span className="wordmark__kanji">海老通</span>
        {!compact && <span className="brand-lockup__tagline">The Shrimp Connoisseur</span>}
      </span>
    </span>
  );
}

export default BrandMark;
export type { BrandMarkProps };
