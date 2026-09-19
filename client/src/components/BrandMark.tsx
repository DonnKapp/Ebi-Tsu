import type { ImgHTMLAttributes } from "react";

type BrandMarkProps = ImgHTMLAttributes<HTMLImageElement> & {
  compact?: boolean;
};

export function BrandMark({
  compact = false,
  className = "",
  ...props
}: BrandMarkProps) {
  return (
    <img
      aria-label="Ebi Tsū shrimp emblem"
      className={`brand-mark ${compact ? "brand-mark--compact" : ""} ${className}`.trim()}
      src="/assets/ebi-tsu-logo.webp"
      alt="Ebi Tsū shrimp emblem"
      role="img"
      {...props}
    />
  );
}

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup ${compact ? "brand-lockup--compact" : ""}`}>
      <BrandMark compact={compact} />
      <span className="brand-lockup__type">
        <span className="wordmark__latin">Ebi Tsū</span>
        <span className="wordmark__kanji">海老通</span>
        {!compact && (
          <span className="brand-lockup__tagline">The Shrimp Connoisseur</span>
        )}
      </span>
    </span>
  );
}

export default BrandMark;
export type { BrandMarkProps };
