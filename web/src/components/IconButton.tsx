import { IconProps } from "@phosphor-icons/react";
import { Button } from "./Button";
import { ComponentProps } from "react";

interface IconButtonProps extends ComponentProps<"button"> {
  onClick: () => void;
  Icon: React.ComponentType<IconProps>;
  title: string;
  variant?: "primary" | "secondary";
}

export const IconButton = ({ onClick, Icon, title, variant = "secondary", className, ...props }: IconButtonProps) => {
  return (
    <Button
      variant={variant}
      size="icon"
      onClick={onClick}
      className={`cursor-pointer border-transparent bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:text-blue-base ${className}`}
      title={title}
      {...props}
    >
      <Icon size={18} />
    </Button>
  );
};