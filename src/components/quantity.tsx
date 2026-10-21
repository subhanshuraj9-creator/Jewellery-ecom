"use client";
import { Minus, Plus } from "lucide-react";
import { MAX_QUANTITY } from "@/lib/cart";
export function Quantity({
  value,
  onChange,
  name = "piece",
}: {
  value: number;
  onChange: (value: number) => void;
  name?: string;
}) {
  return (
    <div className="quantity">
      <button
        aria-label={`Decrease ${name} quantity`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
      >
        <Minus size={13} />
      </button>
      <span aria-label={`${name} quantity`} aria-live="polite">
        {value}
      </span>
      <button
        aria-label={`Increase ${name} quantity`}
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QUANTITY}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}
