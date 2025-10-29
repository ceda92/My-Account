import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "../MyAccount/lib/utils";
import React from "react";
import { Control, useController } from "react-hook-form";

// Create a form-compatible Select
interface FormSelectProps {
  name: string;
  control: Control<any>;
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  control,
  label,
  options,
  placeholder = "Select an option",
  defaultValue = "",
  required = false,
  disabled = false,
  icon,
  loading,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: { required },
    defaultValue,
  });

  return (
    <div className="relative space-y-2 pb-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label} {required && <span>*</span>}
        </label>
      )}

      <Select
        onValueChange={(value: string) => {
          field.onChange(value);
        }}
        value={field.value}
        disabled={disabled || loading}
        key={options.length}
      >
        <SelectTrigger
          id={name}
          className={cn("relative", error && "border-red-500")}
          data-test={`select-${name}`}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="left-3 z-10">{icon}</span>}
            <SelectValue placeholder={loading ? "Loading..." : placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              data-test={`select-option-${option.value}`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="pointer-events-none absolute -bottom-3 left-2 text-xs text-red-500">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
