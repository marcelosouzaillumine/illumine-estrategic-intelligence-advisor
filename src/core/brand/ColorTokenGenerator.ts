/**
 * EVCA-EBIL-001 — ColorTokenGenerator
 * 
 * Generates mathematically derived, WCAG 2.1 AA compliant brand tokens
 * strictly limited to brand-primary scope.
 * 
 * Does NOT override semantic state colors (success, warning, critical, info)
 * or interaction behaviors (focus ring, selection state).
 */

import { DerivedBrandTokens } from './BrandBoundaryContract';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export class ColorTokenGenerator {
  /**
   * Parse hex string to RGB
   */
  public static hexToRgb(hex: string): RGB {
    let cleanHex = hex.replace(/^#/, '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    if (isNaN(num) || cleanHex.length !== 6) {
      // Default to Executive Illumine Primary if invalid
      return { r: 14, g: 28, b: 44 };
    }
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  /**
   * Convert RGB to HEX string
   */
  public static rgbToHex(rgb: RGB): string {
    const toHex = (c: number) => {
      const hex = Math.round(Math.max(0, Math.min(255, c))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
  }

  /**
   * Convert RGB to HSL
   */
  public static rgbToHsl(rgb: RGB): HSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  /**
   * Convert HSL to RGB
   */
  public static hslToRgb(hsl: HSL): RGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Relative Luminance according to WCAG 2.1 definition
   */
  public static getLuminance(rgb: RGB): number {
    const a = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  /**
   * Calculate WCAG contrast ratio between two RGB colors
   */
  public static calculateContrastRatio(rgb1: RGB, rgb2: RGB): number {
    const lum1 = ColorTokenGenerator.getLuminance(rgb1);
    const lum2 = ColorTokenGenerator.getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Derives brand tokens from brandPrimaryColor HEX input
   */
  public static generateTokens(primaryHex: string): DerivedBrandTokens {
    let baseRgb = ColorTokenGenerator.hexToRgb(primaryHex);
    let baseHsl = ColorTokenGenerator.rgbToHsl(baseRgb);

    // WCAG 2.1 AA check: Ensure contrast ratio against white or dark text is >= 4.5:1
    const whiteRgb: RGB = { r: 255, g: 255, b: 255 };
    const darkRgb: RGB = { r: 15, g: 23, b: 42 };

    let contrastWhite = ColorTokenGenerator.calculateContrastRatio(baseRgb, whiteRgb);
    let contrastDark = ColorTokenGenerator.calculateContrastRatio(baseRgb, darkRgb);

    // If max contrast against both white and dark is < 4.5:1, adjust lightness toward optimal contrast
    if (Math.max(contrastWhite, contrastDark) < 4.5) {
      if (contrastWhite >= contrastDark) {
        // Darken lightness until contrast against white is >= 4.5:1
        while (contrastWhite < 4.5 && baseHsl.l > 5) {
          baseHsl.l -= 2;
          baseRgb = ColorTokenGenerator.hslToRgb(baseHsl);
          contrastWhite = ColorTokenGenerator.calculateContrastRatio(baseRgb, whiteRgb);
        }
      } else {
        // Lighten lightness until contrast against dark is >= 4.5:1
        while (contrastDark < 4.5 && baseHsl.l < 95) {
          baseHsl.l += 2;
          baseRgb = ColorTokenGenerator.hslToRgb(baseHsl);
          contrastDark = ColorTokenGenerator.calculateContrastRatio(baseRgb, darkRgb);
        }
      }
    }

    // Select crispest high-contrast text color
    const brandOnPrimary = contrastWhite >= contrastDark ? '#FFFFFF' : '#0F172A';

    // Primary Hover: slightly darker/richer for buttons
    const hoverHsl: HSL = {
      ...baseHsl,
      l: Math.max(10, baseHsl.l - 7)
    };
    const hoverRgb = ColorTokenGenerator.hslToRgb(hoverHsl);

    // Primary Active: even darker for pressed state
    const activeHsl: HSL = {
      ...baseHsl,
      l: Math.max(5, baseHsl.l - 12)
    };
    const activeRgb = ColorTokenGenerator.hslToRgb(activeHsl);

    // Primary Subtle: 12% opacity soft background
    const subtleRgba = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.12)`;

    // Primary Border: 25% opacity border
    const borderRgba = `rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.25)`;

    return {
      brandPrimary: ColorTokenGenerator.rgbToHex(baseRgb),
      brandPrimaryHover: ColorTokenGenerator.rgbToHex(hoverRgb),
      brandPrimaryActive: ColorTokenGenerator.rgbToHex(activeRgb),
      brandPrimarySubtle: subtleRgba,
      brandPrimaryBorder: borderRgba,
      brandOnPrimary
    };
  }
}
