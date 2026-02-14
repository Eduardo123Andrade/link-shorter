import { IconProps } from "@phosphor-icons/react";
import { Button } from "./Button";

interface IconButtonProps {
  onClick: () => void;
  Icon: React.ComponentType<IconProps>;
  title: string;
}

export const IconButton = ({ onClick, Icon, title }: IconButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={onClick}
      className="cursor-pointer border-transparent bg-gray-800 text-gray-300 hover:border-gray-600 hover:bg-gray-700 hover:text-blue-base"
      title={title}
    >
      <Icon size={18} />
    </Button>
  );
};