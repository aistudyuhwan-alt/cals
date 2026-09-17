'use client';

import React from 'react';
import { Input } from '@/components/ui/input';

interface FormattedNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  unitSuffix?: string;
  allowDecimal?: boolean;
}

export function FormattedNumberInput({
  value,
  onChange,
  unitSuffix,
  allowDecimal = false,
  className = '',
  placeholder,
  ...props
}: FormattedNumberInputProps) {
  const displayValue = React.useMemo(() => {
    if (value === 0 && placeholder) return '';
    return value.toLocaleString('ko-KR');
  }, [value, placeholder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '').trim();

    if (rawValue === '') {
      onChange(0);
      return;
    }

    if (allowDecimal) {
      const parsed = parseFloat(rawValue);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    } else {
      const parsed = parseInt(rawValue, 10);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <Input
        type="text"
        inputMode={allowDecimal ? 'decimal' : 'numeric'}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={`pr-10 text-right font-mono ${className}`}
        {...props}
      />
      {unitSuffix && (
        <span className="absolute right-3 text-sm text-neutral-500 pointer-events-none select-none">
          {unitSuffix}
        </span>
      )}
    </div>
  );
}
