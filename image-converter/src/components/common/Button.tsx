import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const sizeClass = size === "sm" ? "btn-sm" : "";

  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
