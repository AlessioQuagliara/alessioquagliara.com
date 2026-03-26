type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-[#2664eb] bg-[#2664eb] text-white shadow-[0_10px_30px_-12px_rgba(38,100,235,0.9)] hover:bg-[#1f55ca] hover:border-[#1f55ca]",
  secondary:
    "border border-[#95b7ff] bg-[#eaf0ff]/20 text-[#eef4ff] hover:border-[#c7daff] hover:bg-[#eaf0ff]/30",
  ghost:
    "border border-transparent bg-transparent text-[#c9ddff] hover:bg-[#d7e5ff]/15 hover:text-white",
  danger:
    "border border-[#e23a5e] bg-[#e23a5e] text-white hover:bg-[#bf2e4d] hover:border-[#bf2e4d]",
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
    "inline-flex items-center justify-center rounded-xl font-medium transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8ab0ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1f4b]",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .join(" ")
    .trim();
}