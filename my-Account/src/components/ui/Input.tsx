import { cn } from "../MyAccount/lib/utils";
import React from "react";
import { Label } from "../ui/label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  unit?: string;
  iconPosition?: "left" | "right";
  width?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      placeholder = "",
      icon,
      type = "text",
      label,
      errorMessage,
      unit,
      iconPosition = "left",
      width,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(errorMessage);
    return (
      <div className={cn("relative mt-1 h-10 pb-6", className)}>
        {label && (
          <Label
            className={cn(
              "absolute -top-2 left-2 z-10 bg-white px-1 text-xs font-medium text-gray-400",
              props.value && "text-gray-400"
            )}
          >
            {label}
          </Label>
        )}
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border border-solid border-dark-blue/30 px-2 py-2 focus-within:outline focus-within:outline-1 focus-within:outline-lime-green",
            width
          )}
        >
          {icon && iconPosition === "left" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <input
            type={type}
            className="w-full grow border-none bg-transparent text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={placeholder}
            ref={ref}
            {...props}
            onChange={props.onChange}
          />
          {icon && iconPosition === "right" && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {unit && (
            <span className="flex-shrink-0 text-sm text-gray-500">{unit}</span>
          )}
        </div>
        {hasError && (
          <p className="pointer-events-none absolute -bottom-5 left-2 text-xs text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
