// FormPhoneInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PhoneInput } from "./PhoneInput";

interface FormPhoneInputProps {
  name: string;
  placeholder?: string;
  className?: string;
}

export const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  placeholder = "Enter a phone number",
  className,
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, name }, fieldState }) => (
        <div className="w-full">
          <PhoneInput
            className={className}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            name={name}
            placeholder={placeholder}
            data-test="Phone-Input"
          />
          {fieldState.error && (
            <p className="mt-1 text-xs text-red-500">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
