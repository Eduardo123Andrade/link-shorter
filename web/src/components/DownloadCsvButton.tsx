import { DownloadSimpleIcon } from "@phosphor-icons/react/DownloadSimple";
import { Button } from "./Button";


interface DownloadCsvButtonProps {
  onDownloadCsv: () => void;
  disabled?: boolean;
}

export const DownloadCsvButton = ({ onDownloadCsv, disabled }: DownloadCsvButtonProps) => {
  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="h-10 gap-2 w-auto bg-gray-200/10 px-4 font-medium text-gray-100 hover:border-transparent hover:bg-gray-200/20"
      onClick={onDownloadCsv}
      disabled={disabled}
    >
      <DownloadSimpleIcon size={18} />
      Baixar CSV
    </Button>
  )
}