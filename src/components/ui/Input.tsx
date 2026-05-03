import { ComponentPropsWithoutRef, forwardRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        className={`pretendard rounded-lg border-2 border-fuchsia-300 p-2 py-2.5 text-base transition-all hover:border-fuchsia-400 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-100 ${className}`}
        ref={ref}
        {...rest}
      />
    );
  }
)

export default Input;

Input.displayName = "Input"
