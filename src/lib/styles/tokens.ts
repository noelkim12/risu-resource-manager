/**
 * 디자인 토큰 시스템
 * CSS 변수 기반의 일관된 스타일 토큰 정의
 */

// Color Tokens
export const colors = {
  // Primary Colors
  primary: "hsl(var(--primary, 220.9 39.3% 11%))",
  "primary-foreground": "hsl(var(--primary-foreground, 210 20% 98%))",

  // Secondary Colors
  secondary: "hsl(var(--secondary, 220 14.3% 95.9%))",
  "secondary-foreground": "hsl(var(--secondary-foreground, 220.9 39.3% 11%))",

  // Accent Colors
  accent: "hsl(var(--accent, 220 14.3% 95.9%))",
  "accent-foreground": "hsl(var(--accent-foreground, 220.9 39.3% 11%))",

  // Muted Colors
  muted: "hsl(var(--muted, 220 14.3% 95.9%))",
  "muted-foreground": "hsl(var(--muted-foreground, 220 8.9% 46.1%))",

  // Destructive Colors
  destructive: "hsl(var(--destructive, 0 84.2% 60.2%))",
  "destructive-foreground": "hsl(var(--destructive-foreground, 210 20% 98%))",

  // Border & Background
  border: "hsl(var(--border, 220 13% 91%))",
  input: "hsl(var(--input, 220 13% 91%))",
  ring: "hsl(var(--ring, 220.9 39.3% 11%))",
  background: "hsl(var(--background, 0 0% 100%))",
  foreground: "hsl(var(--foreground, 220.9 39.3% 11%))",

  // Card Colors
  card: "hsl(var(--card, 0 0% 100%))",
  "card-foreground": "hsl(var(--card-foreground, 220.9 39.3% 11%))",

  // Popover Colors
  popover: "hsl(var(--popover, 0 0% 100%))",
  "popover-foreground": "hsl(var(--popover-foreground, 220.9 39.3% 11%))",
} as const;

// Size Tokens
export const sizes = {
  // Component Sizes
  xs: "0.75rem",    // 12px
  sm: "0.875rem",   // 14px
  md: "1rem",       // 16px
  lg: "1.125rem",   // 18px
  xl: "1.25rem",    // 20px
  "2xl": "1.5rem",  // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
} as const;

// Spacing Tokens
export const spacing = {
  0: "0",
  1: "0.25rem",   // 4px
  2: "0.5rem",    // 8px
  3: "0.75rem",   // 12px
  4: "1rem",      // 16px
  5: "1.25rem",   // 20px
  6: "1.5rem",    // 24px
  8: "2rem",      // 32px
  10: "2.5rem",   // 40px
  12: "3rem",     // 48px
  16: "4rem",     // 64px
  20: "5rem",     // 80px
  24: "6rem",     // 96px
} as const;

// Typography Tokens
export const typography = {
  fontFamily: {
    sans: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },
  fontSize: {
    xs: ["0.75rem", { lineHeight: "1rem" }],      // 12px
    sm: ["0.875rem", { lineHeight: "1.25rem" }],  // 14px
    base: ["1rem", { lineHeight: "1.5rem" }],     // 16px
    lg: ["1.125rem", { lineHeight: "1.75rem" }],  // 18px
    xl: ["1.25rem", { lineHeight: "1.75rem" }],   // 20px
    "2xl": ["1.5rem", { lineHeight: "2rem" }],    // 24px
    "3xl": ["1.875rem", { lineHeight: "2.25rem" }], // 30px
    "4xl": ["2.25rem", { lineHeight: "2.5rem" }], // 36px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;

// Border Radius Tokens
export const borderRadius = {
  none: "0",
  sm: "0.125rem",   // 2px
  md: "0.375rem",   // 6px
  lg: "0.5rem",     // 8px
  xl: "0.75rem",    // 12px
  "2xl": "1rem",    // 16px
  "3xl": "1.5rem",  // 24px
  full: "9999px",
} as const;

// Shadow Tokens
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  none: "0 0 #0000",
} as const;

// Transition Tokens
export const transitions = {
  none: "none",
  all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  default: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  colors: "color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

// Component Variants
export const componentVariants = {
  button: {
    variant: ["default", "destructive", "outline", "secondary", "ghost", "link"] as const,
    size: ["sm", "md", "lg", "xl"] as const,
  },
  input: {
    variant: ["default", "ghost"] as const,
    size: ["sm", "md", "lg", "xl"] as const,
  },
  badge: {
    variant: ["default", "secondary", "destructive", "outline"] as const,
    size: ["sm", "md", "lg"] as const,
  },
} as const;

// Type Definitions
export type ColorToken = keyof typeof colors;
export type SizeToken = keyof typeof sizes;
export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type TransitionToken = keyof typeof transitions;

export type ButtonVariant = typeof componentVariants.button.variant[number];
export type ButtonSize = typeof componentVariants.button.size[number];
export type InputVariant = typeof componentVariants.input.variant[number];
export type InputSize = typeof componentVariants.input.size[number];
export type BadgeVariant = typeof componentVariants.badge.variant[number];
export type BadgeSize = typeof componentVariants.badge.size[number];