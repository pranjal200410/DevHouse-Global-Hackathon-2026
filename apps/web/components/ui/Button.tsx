import clsx from "clsx";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  variant?: "primary" | "secondary";
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 shadow-[0_18px_45px_-20px_rgba(16,185,129,0.48)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-24px_rgba(16,185,129,0.45)]",
  secondary:
    "border border-slate-700/80 bg-slate-900/90 text-slate-100 hover:border-slate-500/70 hover:bg-slate-800/95",
};

function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  className,
  ...props
}: ButtonProps<T>) {
  const Component = as ?? "button";

  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
        variantStyles[variant],
        className
      )}
      {...(props as ComponentPropsWithoutRef<T>)}
    />
  );
}

export { Button };