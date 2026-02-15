import { ComponentProps, forwardRef } from "react";

interface TextInputProps extends ComponentProps<"input"> {
  prefix?: string;
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ prefix, className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {props.label && (
          <label htmlFor={props.id} className="text-sm font-medium text-gray-200">
            {props.label}
          </label>
        )}
        <div className={`group flex h-12 w-full items-center gap-3 rounded-lg border bg-gray-900 px-4 ${error ? "border-danger" : "border-gray-800 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500"} ${className}`}>
          {prefix && <span className="text-gray-400 select-none">{prefix}</span>}

          <input
            ref={ref}
            className="flex-1 bg-transparent text-gray-100 placeholder:text-gray-400 focus:outline-none"
            {...props}
          />
        </div>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
