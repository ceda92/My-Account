import * as React from "react";
import { cn } from "../MyAccount/lib/utils";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FloatingLabelSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const FloatingLabelSelect = ({
  label,
  placeholder = "Select option",
  value,
  onValueChange,
  options,
  className,
  triggerClassName,
  disabled,
  icon,
}: FloatingLabelSelectProps) => {
  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label
          className={cn(
            "absolute -top-2 left-2 z-10 bg-white px-1 text-xs font-medium text-gray-400",
            value && "text-gray-400"
          )}
        >
          {label}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={cn("border-dark-blue/30", triggerClassName)}>
          <div className="flex w-full items-center gap-2 overflow-hidden">
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <SelectValue placeholder={placeholder} className="truncate" />
          </div>
        </SelectTrigger>
        <SelectContent className="border border-gray-200 bg-white shadow-lg">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FloatingLabelSelect;
