import React, { useState } from 'react';
import { BUSINESS_INFO } from '../data/equipment';

interface BrandSymbolProps {
  className?: string;
}

/**
 * Displays ONLY the canopy symbol from the uploaded transparent-background logo PNG
 * while preserving exact original proportions and transparent background.
 */
export const BrandSymbol: React.FC<BrandSymbolProps> = ({
  className = 'h-10 sm:h-11',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <span
      className={`relative inline-block aspect-[641/407] overflow-hidden shrink-0 ${className}`}
    >
      <img
        src={BUSINESS_INFO.emblemImage}
        alt="Vvichelae Event Rentals Symbol"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="absolute max-w-none w-[338.845%] h-[177.887%] -left-[7.644%] -top-[31.695%] pointer-events-none select-none"
      />
    </span>
  );
};

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  compact?: boolean;
  showEmblem?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  compact = false,
  showEmblem = true,
}) => {
  const titleColor = variant === 'light' ? 'text-[#FFF9F0]' : 'text-[#245B59]';
  const subColor = variant === 'light' ? 'text-[#E8C994]' : 'text-[#245B59]';

  return (
    <span className="inline-flex items-center gap-3 select-none whitespace-nowrap shrink-0">
      {showEmblem && (
        <span
          className={
            variant === 'light'
              ? 'inline-flex items-center justify-center rounded-lg bg-[#FFF9F0] px-2 py-1.5 shrink-0'
              : 'inline-flex items-center justify-center shrink-0'
          }
        >
          <BrandSymbol className={compact ? 'h-9 sm:h-10' : 'h-11 sm:h-12'} />
        </span>
      )}

      <span className="inline-flex flex-col justify-center leading-none">
        <span
          className={`font-serif font-bold tracking-[0.11em] uppercase ${
            compact ? 'text-xl sm:text-[1.35rem]' : 'text-2xl sm:text-[1.6rem]'
          } ${titleColor}`}
        >
          {BUSINESS_INFO.shortName}
        </span>
        <span
          className={`mt-1 font-sans text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase ${subColor}`}
        >
          {BUSINESS_INFO.subName}
        </span>
      </span>
    </span>
  );
};
