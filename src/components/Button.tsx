import { cn } from "@/utils/style";
import { ComponentPropsWithoutRef, FC } from "react";

type Variant = "default" | "danger" | "outline";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
};

const variantStyles: Record<Variant, string> = {
  default: "bg-gray-600 hover:bg-gray-700",
  danger: "bg-red-500 hover:bg-red-600",
  outline: "bg-white border border-gray-500 text-gray-600",
};

const Button: FC<ButtonProps> = ({ className, children, variant = "default", ...rest }) => {
  return (
    <button
      className={cn(
        "w-full rounded-md py-2.5 text-sm font-medium text-white transition",
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
