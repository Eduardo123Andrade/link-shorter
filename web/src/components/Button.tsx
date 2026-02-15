import { ComponentProps } from "react";
import { tv, VariantProps } from "tailwind-variants";

const button = tv({
  base: "flex h-12 w-full items-center justify-center rounded-lg px-6 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-[url('/cursors/not-allowed.svg')_12_12,not-allowed]",
  variants: {
    variant: {
      primary: `
        bg-blue-base text-white
        hover:bg-blue-dark
        focus:ring-blue-base focus:ring-offset-gray-100
        disabled:bg-blue-base disabled:opacity-50 disabled:hover:bg-blue-base
      `,
      secondary: `
        bg-gray-200 text-gray-500 border border-gray-600
        hover:bg-gray-500 hover:text-gray-100
        focus:ring-0 focus:ring-offset-0 active:border-transparent
        disabled:hover:border-gray-600 disabled:hover:bg-gray-200
        cursor-pointer
      `,
    },
    size: {
      default: "h-12",
      sm: "h-10 px-4 text-sm",
      icon: "h-10 w-10 px-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof button> {
  loading?: boolean;
}

export function Button({ children, className, variant, size, loading, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={button({ variant, size, className })}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
