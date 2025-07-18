import { Check } from "lucide-react";

import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { HabitColor } from "@/api/types/appTypes";

interface ColorPickerProps {
  value: HabitColor;
  onChange: (value: HabitColor) => void;
  disabled?: boolean;
}

export function ColorPicker({ value, onChange, disabled }: ColorPickerProps) {
  const colorOptions = Object.entries(HabitColor).map(([key, value]) => ({
    value: value,
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  }));

  return (
    <div className="space-y-2">
      <Label>Color</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-4 gap-4"
        disabled={disabled}
      >
        {colorOptions.map((option) => (
          <div
            key={option.value}
            className="flex flex-col items-center space-y-2"
          >
            <div className="flex items-center justify-center relative">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="sr-only peer"
                disabled={disabled}
              />
              <Label
                htmlFor={option.value}
                className="w-8 h-8 rounded-full cursor-pointer ring-offset-background transition-all hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 relative flex items-center justify-center"
                style={{ backgroundColor: option.value }}
              >
                <div
                  className="absolute inset-0"
                  style={{ "--color": option.value } as React.CSSProperties}
                />
                {value === option.value && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </Label>
            </div>
            <span className="text-xs">{option.label}</span>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
