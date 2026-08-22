import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  required,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-neutral-700"
      >
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        className={`
          w-full px-3 py-2 text-sm rounded-lg border
          bg-white text-neutral-900 placeholder:text-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          disabled:bg-neutral-100 disabled:cursor-not-allowed
          ${error ? "border-error focus:ring-error" : "border-neutral-300"}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="text-xs text-neutral-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
