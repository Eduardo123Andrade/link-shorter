import { IconProps } from "@phosphor-icons/react";
import { Button } from "./Button";
import { ComponentProps } from "react";

interface IconButtonProps extends ComponentProps<"button"> {
  onClick: () => void;
  Icon: React.ComponentType<IconProps>;
  title: string;
}

export const IconButton = ({ onClick, Icon, title, className, ...props }: IconButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={onClick}
      className={`cursor-pointer border-transparent bg-gray-200 text-gray-500 active:border-0 focus:ring-0 focus:ring-offset-0 ${className}`}
      title={title}
      {...props}
    >
      <Icon size={18} />
    </Button>
  );
};