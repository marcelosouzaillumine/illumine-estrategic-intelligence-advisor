/**
 * EVCA-EBIL-001 — BrandLogo & CanonicalBrandSignature Component
 * 
 * Fundamental Rule:
 * "The container governs the logo. The logo never governs the container."
 * 
 * Canonical Brand Signature Pattern across all Illumine Landing Pages:
 * [Icon (/logo.png)] + [Wordmark ('illumine' in Tilt Warp)] + [Encapsulated Category Pill Badge]
 */

import React, { useState } from 'react';
import { useBrandIdentity } from '../../../../context/BrandIdentityProvider';

export interface BrandLogoProps {
  variant?: 'header' | 'login' | 'splash' | 'compact';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  showNameFallback?: boolean;
}

export interface CanonicalBrandSignatureProps {
  categoryBadge?: string;
  onClick?: () => void;
  className?: string;
}

export const CanonicalBrandSignature: React.FC<CanonicalBrandSignatureProps> = ({
  categoryBadge,
  onClick,
  className = ''
}) => {
  return (
    <div 
      className={`flex items-center gap-1.5 sm:gap-2 cursor-pointer group shrink-0 ${className}`} 
      onClick={onClick}
    >
      <div className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] flex items-center justify-center shrink-0 relative">
        <img 
          src="/logo.png" 
          alt="Illumine Brand Icon" 
          className="w-full h-full object-contain block shrink-0"
        />
      </div>
      <span 
        className="text-[26px] sm:text-[32px] tracking-[-0.06em] text-white leading-none block font-medium" 
        style={{ fontFamily: '"Tilt Warp", sans-serif' }}
      >
        illumine
      </span>
      {categoryBadge && (
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#FF8A57]/10 border border-[#FF8A57]/30 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#FF8A57] font-bold shrink-0 ml-1 sm:ml-1.5">
          {categoryBadge}
        </span>
      )}
    </div>
  );
};

const VARIANT_CONTAINER_STYLES: Record<NonNullable<BrandLogoProps['variant']>, string> = {
  header: 'h-8 max-h-8 max-w-[180px] flex items-center justify-start overflow-hidden',
  login: 'h-12 max-h-12 max-w-[240px] flex items-center justify-center overflow-hidden',
  splash: 'h-16 max-h-16 max-w-[280px] flex items-center justify-center overflow-hidden',
  compact: 'h-6 max-h-6 max-w-[120px] flex items-center justify-start overflow-hidden'
};

const VARIANT_IMAGE_STYLES: Record<NonNullable<BrandLogoProps['variant']>, string> = {
  header: 'h-full max-h-8 w-auto object-contain shrink-0',
  login: 'h-full max-h-12 w-auto object-contain shrink-0',
  splash: 'h-full max-h-16 w-auto object-contain shrink-0',
  compact: 'h-full max-h-6 w-auto object-contain shrink-0'
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  theme = 'auto',
  className = '',
  showNameFallback = true
}) => {
  const { activeBrand } = useBrandIdentity();
  const [imageError, setImageError] = useState(false);

  const logoSrc = theme === 'dark' && activeBrand.logoDark
    ? activeBrand.logoDark
    : activeBrand.logoLight;

  const containerClasses = `${VARIANT_CONTAINER_STYLES[variant]} ${className}`;
  const imageClasses = VARIANT_IMAGE_STYLES[variant];

  if (!logoSrc || imageError) {
    if (!showNameFallback) return null;
    return (
      <div className={containerClasses} data-testid="brand-logo-fallback">
        <span className="font-display font-bold tracking-tight text-executive-primary truncate">
          {activeBrand.organizationName}
        </span>
      </div>
    );
  }

  return (
    <div className={containerClasses} data-testid="brand-logo-container">
      <img
        src={logoSrc}
        alt={`${activeBrand.organizationName} Logo`}
        className={imageClasses}
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default CanonicalBrandSignature;
