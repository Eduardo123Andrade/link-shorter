import { ComponentProps, useRef } from "react";

interface TextInputProps extends ComponentProps<"input"> {
  prefix?: string;
  label?: string;
}

export function TextInput({ prefix, className, value, onChange, ...props }: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (onChange) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
      
      if (inputRef.current && nativeInputValueSetter) {
        nativeInputValueSetter.call(inputRef.current, "");
        const event = new Event("input", { bubbles: true });
        inputRef.current.dispatchEvent(event);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {props.label && (
        <label htmlFor={props.id} className="text-sm font-medium text-gray-200">
          {props.label}
        </label>
      )}
      <div className={`group flex h-12 w-full items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 ${className}`}>
        {prefix && <span className="text-gray-400 select-none">{prefix}</span>}
        
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-gray-100 placeholder:text-gray-400 focus:outline-none"
          value={value}
          onChange={onChange}
          {...props}
        />

        {value && (
          <button
            onClick={handleClear}
            type="button"
            className="text-gray-400 hover:text-gray-100 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
