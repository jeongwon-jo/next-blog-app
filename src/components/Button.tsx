import { cn } from "@/utils/style";
import { ComponentPropsWithoutRef, FC } from "react";

type Variant = "default" | "danger" | "outline";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
};

const variantStyles: Record<Variant, string> = {
  default: "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white",
  danger: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white",
  outline: "bg-white border-2 border-fuchsia-400 text-fuchsia-600 hover:bg-fuchsia-50",
};

const Button: FC<ButtonProps> = ({ className, children, variant = "default", ...rest }) => {
  return (
    <button
      className={cn(
        "w-full rounded-lg py-3 text-sm font-semibold shadow-sm transition-all duration-200",
        variantStyles[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
