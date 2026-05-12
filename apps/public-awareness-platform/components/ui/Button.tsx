import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-ug-gold text-ug-blue-dark font-bold hover:bg-ug-gold-light active:bg-ug-gold-dark",
  secondary:
    "bg-ug-blue text-white font-bold hover:bg-ug-blue-mid active:bg-ug-blue-dark",
  outline:
    "border-2 border-ug-blue text-ug-blue font-bold hover:bg-ug-blue hover:text-white",
  ghost:
    "text-ug-blue font-medium hover:bg-ug-blue-pale underline underline-offset-4",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base tracking-wide",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  external = false,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ariaLabel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ug-gold focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
