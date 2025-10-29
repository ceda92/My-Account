// FormInput.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import Input from "../ui/Input";

interface FormInputProps {
  name: string;
  placeholder?: string;
  className?: string;
  label?: string;
  type?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  placeholder = "",
  className,
  label,
  type = "text",
  icon,
  iconPosition = "left",
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Input
          {...field}
          className={className}
          placeholder={placeholder}
          label={label}
          type={type}
          errorMessage={fieldState.error?.message}
          icon={icon}
          iconPosition={iconPosition}
        />
      )}
    />
  );
};
