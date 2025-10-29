import React from "react";
import Input from "../ui/Input";
import { ReactComponent as PercentageIcon } from "@icon/percentage.svg";

interface PercentageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
  maxValue?: number;
}

const PercentageInput = React.forwardRef<
  HTMLInputElement,
  PercentageInputProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Enter percentage",
      errorMessage,
      className,
      disabled,
      maxValue = 100,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        const numValue = parseFloat(inputValue);
        if (inputValue === "" || numValue <= maxValue) {
          onChange(inputValue);
        }
      }
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          errorMessage={errorMessage}
          className={className}
          disabled={disabled}
          type="text"
          {...props}
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm select-none pointer-events-none z-10">
          <PercentageIcon className="w-5 h-5" />
        </span>
      </div>
    );
  }
);

PercentageInput.displayName = "PercentageInput";

export default PercentageInput;
