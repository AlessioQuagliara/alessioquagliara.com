type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[#2664eb] bg-[#2664eb] text-white hover:bg-[#1f55ca] hover:border-[#1f55ca]",
  secondary:
    "border border-white/20 bg-transparent text-[#eef4ff] hover:border-[#8cb4ff] hover:bg-white/5",
  ghost:
    "border border-transparent bg-transparent text-[#c9ddff] hover:bg-[#d7e5ff]/15 hover:text-white",
  danger:
    "border border-[#e23a5e] bg-[#e23a5e] text-white hover:bg-[#bf2e4d] hover:border-[#bf2e4d]",
  // Variante per superfici chiare (blog light-only): bordo tenue, testo blu.
  outline:
    "border border-[#d0d7e2] bg-white text-[#1d4ed8] hover:border-[#1d4ed8] hover:bg-[#f1f5ff]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
}: ButtonClassOptions = {}): string {
  return [
    "inline-flex items-center justify-center rounded-lg font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06112a]",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .join(" ")
    .trim();
}