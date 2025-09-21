/**
 * 컴포넌트 스타일 유틸리티
 * 재사용 가능한 스타일 함수와 클래스 생성기
 */

import type {
  ButtonVariant,
  ButtonSize,
  InputVariant,
  InputSize,
  BadgeVariant,
  BadgeSize,
} from "./tokens";

/**
 * 클래스명 조합 유틸리티
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Button 스타일 생성기
 */
export function getButtonStyles(variant: ButtonVariant = "default", size: ButtonSize = "md") {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "justify-center",
    "rounded-lg",
    "font-medium",
    "transition-all",
    "duration-150",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:opacity-50",
    "disabled:pointer-events-none",
  ];

  const variantClasses = {
    default: [
      "bg-primary",
      "text-primary-foreground",
      "hover:bg-primary/90",
      "shadow-sm",
    ],
    destructive: [
      "bg-destructive",
      "text-destructive-foreground",
      "hover:bg-destructive/90",
      "shadow-sm",
    ],
    outline: [
      "border",
      "border-input",
      "bg-background",
      "hover:bg-accent",
      "hover:text-accent-foreground",
    ],
    secondary: [
      "bg-secondary",
      "text-secondary-foreground",
      "hover:bg-secondary/80",
      "shadow-sm",
    ],
    ghost: [
      "hover:bg-accent",
      "hover:text-accent-foreground",
    ],
    link: [
      "text-primary",
      "underline-offset-4",
      "hover:underline",
    ],
  };

  const sizeClasses = {
    sm: ["h-8", "px-3", "text-sm"],
    md: ["h-10", "px-4", "text-sm"],
    lg: ["h-11", "px-8", "text-base"],
    xl: ["h-12", "px-10", "text-base"],
  };

  return cn(
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size]
  );
}

/**
 * Input 스타일 생성기
 */
export function getInputStyles(variant: InputVariant = "default", size: InputSize = "md") {
  const baseClasses = [
    "flex",
    "w-full",
    "min-w-0", // flex 컨테이너에서 최소 너비 보장
    "rounded-lg",
    "border-2", // 테두리를 더 굵게
    "bg-white", // 명확한 배경색
    "text-gray-900", // 명확한 텍스트 색상
    "transition-all", // 모든 속성에 트랜지션
    "duration-200", // 약간 더 긴 애니메이션
    "placeholder:text-gray-500",
    "hover:border-blue-300", // 호버 시 테두리 색상
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500/20", // 포커스 링 색상
    "focus:border-blue-500", // 포커스 시 테두리 색상
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "disabled:bg-gray-50",
  ];

  const variantClasses = {
    default: [
      "border-gray-300",
      "shadow-sm", // 약간의 그림자 추가
    ],
    ghost: [
      "border-transparent",
      "bg-transparent",
      "focus:bg-white",
      "focus:border-blue-500",
    ],
  };

  const sizeClasses = {
    sm: ["h-9", "px-3", "py-2", "text-sm", "min-w-[120px]"], // 최소 너비 설정
    md: ["h-11", "px-4", "py-3", "text-base", "min-w-[200px]"], // 더 넓은 기본 너비
    lg: ["h-12", "px-5", "py-3", "text-base", "min-w-[240px]"],
    xl: ["h-14", "px-6", "py-4", "text-lg", "min-w-[280px]"],
  };

  return cn(
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size]
  );
}

/**
 * Slider 스타일 생성기
 */
export function getSliderStyles(variant: InputVariant = "default", size: InputSize = "md") {
  const baseClasses = [
    "relative",
    "w-full",
    "cursor-pointer",
    "border",
    "transition-all",
    "duration-300",
    "ease-out",
    "bg-gradient-to-r",
    "overflow-hidden",
    "hover:shadow-md",
    "focus-within:shadow-lg",
    "group/slider",
  ];

  const variantClasses = {
    default: [
      "border-gray-200",
      "shadow-sm",
      "hover:border-gray-300",
      "focus-within:border-blue-400",
    ],
    ghost: [
      "border-gray-100",
      "bg-gray-50/50",
      "hover:bg-gray-100/50",
      "focus-within:bg-white",
    ],
  };

  const sizeClasses = {
    sm: ["h-6"],
    md: ["h-7"],
    lg: ["h-8"],
    xl: ["h-9"],
  };

  return cn(
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size]
  );
}

/**
 * Badge 스타일 생성기
 */
export function getBadgeStyles(variant: BadgeVariant = "default", size: BadgeSize = "md") {
  const baseClasses = [
    "inline-flex",
    "items-center",
    "rounded-full",
    "border",
    "font-semibold",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-ring",
    "focus:ring-offset-2",
  ];

  const variantClasses = {
    default: [
      "border-transparent",
      "bg-primary",
      "text-primary-foreground",
      "hover:bg-primary/80",
    ],
    secondary: [
      "border-transparent",
      "bg-secondary",
      "text-secondary-foreground",
      "hover:bg-secondary/80",
    ],
    destructive: [
      "border-transparent",
      "bg-destructive",
      "text-destructive-foreground",
      "hover:bg-destructive/80",
    ],
    outline: [
      "text-foreground",
      "border-input",
      "hover:bg-accent",
      "hover:text-accent-foreground",
    ],
  };

  const sizeClasses = {
    sm: ["px-2", "py-0.5", "text-xs"],
    md: ["px-2.5", "py-0.5", "text-xs"],
    lg: ["px-3", "py-1", "text-sm"],
  };

  return cn(
    ...baseClasses,
    ...variantClasses[variant],
    ...sizeClasses[size]
  );
}

/**
 * Card 스타일 생성기
 */
export function getCardStyles(variant: "default" | "elevated" | "outlined" = "default") {
  const baseClasses = [
    "rounded-lg",
    "border",
    "bg-card",
    "text-card-foreground",
  ];

  const variantClasses = {
    default: ["shadow-sm"],
    elevated: ["shadow-lg"],
    outlined: ["border-2"],
  };

  return cn(...baseClasses, ...variantClasses[variant]);
}

/**
 * Glassmorphism 효과 스타일 생성기
 */
export function getGlassStyles(intensity: "light" | "medium" | "strong" = "medium") {
  const baseClasses = [
    "backdrop-blur-xl",
    "border",
    "border-white/20",
  ];

  const intensityClasses = {
    light: ["bg-white/40"],
    medium: ["bg-white/60"],
    strong: ["bg-white/80"],
  };

  return cn(...baseClasses, ...intensityClasses[intensity]);
}

/**
 * Focus ring 스타일
 */
export const focusRing = [
  "focus-visible:outline-none",
  "focus-visible:ring-2",
  "focus-visible:ring-ring",
  "focus-visible:ring-offset-2",
];

/**
 * 애니메이션 스타일
 */
export const animations = {
  fadeIn: "animate-in fade-in duration-150",
  fadeOut: "animate-out fade-out duration-150",
  slideIn: "animate-in slide-in-from-bottom-2 duration-150",
  slideOut: "animate-out slide-out-to-bottom-2 duration-150",
  scaleIn: "animate-in zoom-in-95 duration-150",
  scaleOut: "animate-out zoom-out-95 duration-150",
};

/**
 * 공통 레이아웃 스타일
 */
export const layouts = {
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexStart: "flex items-center justify-start",
  flexEnd: "flex items-center justify-end",
  gridCenter: "grid place-items-center",
};

/**
 * 반응형 헬퍼
 */
export function responsive(classes: Record<string, string>) {
  return Object.entries(classes)
    .map(([breakpoint, className]) =>
      breakpoint === "default" ? className : `${breakpoint}:${className}`
    )
    .join(" ");
}

/**
 * 조건부 클래스 헬퍼
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass?: string
): string {
  return condition ? trueClass : falseClass || "";
}