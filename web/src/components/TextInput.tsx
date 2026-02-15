import { ComponentProps, forwardRef } from "react";
import { WarningIcon } from "@phosphor-icons/react/Warning";
import { tv } from "tailwind-variants";

const inputContainer = tv({
  base: "group flex h-12 w-full items-center gap-3 rounded-lg border bg-gray-900 px-4 transition-colors",
  variants: {
    state: {
      default: "border-gray-300 focus-within:border-blue-base",
      error: "border-danger",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

const labelText = tv({
  base: "text-sm font-medium transition-colors",
  variants: {
    state: {
      default: "text-gray-300 group-focus-within:text-blue-base",
      error: "text-danger",
    },
  },
  defaultVariants: {
    state: "default",
  },
});

interface TextInputProps extends ComponentProps<"input"> {
  prefix?: string;
  label?: string;
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ prefix, className, error, ...props }, ref) => {
    const currentState = error ? "error" : "default";

    return (
      <div className="group flex flex-col gap-1">
        {props.label && (
          <label htmlFor={props.id} className={labelText({ state: currentState })}>
            {props.label}
          </label>
        )}

        <div className={inputContainer({ state: currentState, className })}>
          {prefix && <span className="text-gray-400 select-none">{prefix}</span>}

          <input
            ref={ref}
            className="flex-1 bg-transparent text-gray-600 placeholder:text-gray-400 focus:outline-none focus:placeholder-transparent"
            {...props}
          />
        </div>
        
        {error && (
          <div className="flex items-center gap-1">
            <WarningIcon className="text-danger" size={16} />
            <span className="text-xs text-gray-500">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
