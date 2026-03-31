"use client";

import { Input } from "@/components/ui/input";

interface EngravingInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function EngravingInput({
  value,
  onChange,
  maxLength = 20,
}: EngravingInputProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">
        Free Custom Engraving{" "}
        <span className="font-normal text-muted-foreground">
          (up to {maxLength} characters)
        </span>
      </p>
      <Input
        type="text"
        maxLength={maxLength}
        placeholder="e.g. Forever Yours"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[280px]"
      />
      <div className="mt-1 flex items-center justify-between max-w-[280px]">
        <p className="text-xs text-muted-foreground">
          {value.length}/{maxLength} characters
        </p>
        <p className="text-xs text-muted-foreground">
          For custom graphics, email daniel@rebirth.world
        </p>
      </div>
    </div>
  );
}
