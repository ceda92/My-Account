import React from "react";
import Input from "../ui/Input";
import { ReactComponent as DollarIcon } from "@icon/dollar.svg";

interface FlatFeeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
  maxValue?: number;
}

const FlatFeeInput = React.forwardRef<HTMLInputElement, FlatFeeInputProps>(
  (
    {
      value,
      onChange,
      placeholder = "Enter amount",
      errorMessage,
      className,
      disabled,

      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        const numValue = parseFloat(inputValue);

        onChange(inputValue);
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
          <DollarIcon className="w-5 h-5" />
        </span>
      </div>
    );
  }
);

FlatFeeInput.displayName = "FlatFeeInput";

export default FlatFeeInput;
