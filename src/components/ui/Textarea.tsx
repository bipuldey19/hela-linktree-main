"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent hover:border-gray-400 resize-vertical ${
            error ? "border-red-300 focus:ring-red-500" : ""
          } ${className}`}
          rows={3}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
