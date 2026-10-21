"use client";
import { productOptions, type Product } from "@/lib/products";

export function FitOptions({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: string;
  onChange: (value: string) => void;
}) {
  const options = productOptions(product);
  if (!options) return null;
  return (
    <fieldset className="product-options">
      <legend>
        {options.label}: {value}
      </legend>
      <div>
        {options.values.map((option) => (
          <button
            key={option}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <span className="fit-option-note">
        Adjustable with the included extender.
      </span>
    </fieldset>
  );
}
