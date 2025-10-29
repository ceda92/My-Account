/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-curly-brace-presence */
import { format } from "date-fns";
import * as React from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "../MyAccount/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { Label } from "./label";
import dayjs from "dayjs";

export default function DatePicker({
  onSelect,
  value,
  placeholder,
  disabledDates,
  label,

  className,
  clearable = true,
}: {
  onSelect: (date: dayjs.Dayjs | null) => void;
  value?: dayjs.Dayjs;
  placeholder?: string;
  disabledDates?:
    | ((date: dayjs.Dayjs) => boolean)
    | { from: dayjs.Dayjs; to: dayjs.Dayjs }
    | dayjs.Dayjs[];
  label?: string;

  className?: string;
  clearable?: boolean;
}) {
  const dateValue = value?.toDate();
  const [open, setOpen] = React.useState(false);

  // Convert the disabled dates logic to work with native Date objects
  const convertedDisabledDates = React.useMemo(() => {
    if (!disabledDates) return undefined;
    if (typeof disabledDates === "function") {
      return (date: Date) => disabledDates(dayjs(date));
    }
    if (Array.isArray(disabledDates)) {
      return disabledDates.map((d) => d.toDate());
    }
    return {
      from: disabledDates.from.toDate(),
      to: disabledDates.to.toDate(),
    };
  }, [disabledDates]);

  // Handle date selection by converting Date back to dayjs
  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      if (date) {
        onSelect(dayjs(date));
      }
      setOpen(false);
    },
    [onSelect, dateValue]
  );

  // Handle clearing the date
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(null);
    },
    [onSelect]
  );

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label
          className={cn(
            "absolute -top-2 left-2 z-10 rounded bg-white px-1 text-xs font-medium text-gray-400",
            value && "text-gray-400"
          )}
        >
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "relative w-[200px] justify-start border-dark-blue/30 py-1 text-left font-normal",
              !value && "text-muted-foreground"
            )}
            data-test="date-picker-trigger"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            {dateValue ? (
              format(dateValue, "MMM do, yyyy")
            ) : (
              <span className="text-gray-400">
                {placeholder ?? "Pick a Date"}
              </span>
            )}
            {clearable && dateValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 h-5 w-5 rounded-full p-0 opacity-70 hover:opacity-100"
                onClick={handleClear}
                data-test="date-picker-clear"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            autoFocus
            disabled={convertedDisabledDates}
            defaultMonth={dateValue || undefined}
            data-test="date-picker-calendar"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
