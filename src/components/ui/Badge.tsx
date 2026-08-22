import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "draft" | "accent";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-neutral-100 text-neutral-600",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  draft: "bg-neutral-100 text-neutral-500",
  accent: "bg-orange-50 text-orange-700",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
