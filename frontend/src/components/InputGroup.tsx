import React from 'react';

interface InputGroupProps {
  label: string;
  value: number | string;
  onChange: (val: any) => void;
  type?: 'number' | 'text' | 'select';
  options?: { label: string; value: any }[];
  unit?: string;
  unitOptions?: { label: string; value: any }[];
  onUnitChange?: (val: any) => void;
  selectedUnit?: any;
  step?: string;
  compact?: boolean;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  value,
  onChange,
  type = 'number',
  options,
  unit,
  unitOptions,
  onUnitChange,
  selectedUnit,
  step = "0.01",
  compact = false
}) => {
  const containerClass = compact ? "mb-1" : "mb-4";
  const labelClass = compact ? "block text-xs font-medium text-gray-700 mb-0.5" : "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = compact 
    ? "flex-1 min-w-0 block w-full px-2 py-1 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500 text-xs"
    : "flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500 sm:text-sm";
  const unitSelectClass = compact
    ? "ml-1 block w-16 px-1 py-1 rounded-md border border-gray-300 bg-gray-50 text-gray-500 focus:ring-green-500 focus:border-green-500 text-xs"
    : "ml-2 block w-24 px-3 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-500 focus:ring-green-500 focus:border-green-500 sm:text-sm";
  const unitSpanClass = compact
    ? "inline-flex items-center px-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-xs"
    : "inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm";

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center">
        <label className={labelClass}>{label}</label>
      </div>
      <div className="flex rounded-md shadow-sm">
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            step={step}
            value={value}
            onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            className={inputClass}
          />
        )}
        
        {unitOptions ? (
          <select
            value={selectedUnit}
            onChange={(e) => onUnitChange && onUnitChange(parseInt(e.target.value))}
            className={unitSelectClass}
          >
            {unitOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : unit ? (
          <span className={unitSpanClass}>
            {unit}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default InputGroup;
