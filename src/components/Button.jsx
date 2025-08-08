import React from "react";
import clsx from "clsx";

/**
 * Safaré Button (self-contained styles)
 * Variants: "primary" | "secondary" | "light" | "ghost" | "link"
 * Back-compat flags: secondary, light, link
 */
export default function Button({
  className,
  children,
  variant,
  secondary,
  light,
  link,
  disabled,
  ...props
}) {
  // Backward-compat mapping
  const resolvedVariant =
    variant || (link ? "link" : light ? "light" : secondary ? "secondary" : "primary");

  const base =
    "inline-flex items-center justify-center px-5 py-2.5 m-1 rounded-md " +
    "text-sm font-semibold transition duration-200 focus:outline-none";

  const variants = {
    primary:
      // Maroon
      "bg-[#8B0000] text-white hover:bg-[#6e0000] " +
      "focus:ring-4 focus:ring-[#8B0000]/20 shadow",
    secondary:
      // Gold
      "bg-[#FFD700] text-[#1A1A1A] hover:brightness-95 " +
      "focus:ring-4 focus:ring-[#FFD700]/30 shadow",
    light:
      "bg-white text-[#1A1A1A] border border-black/10 hover:bg-[#f3f3f3] " +
      "focus:ring-4 focus:ring-black/10",
    ghost:
      "bg-transparent text-[#8B0000] hover:text-[#6e0000] " +
      "focus:ring-4 focus:ring-[#8B0000]/15",
    link:
      "bg-transparent text-[#8B0000] p-0 m-0 shadow-none " +
      "hover:text-[#6e0000] focus:ring-0",
  };

  return (
    <button
      className={clsx(
        base,
        variants[resolvedVariant],
        disabled && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
