import { DownloadSimpleIcon } from "@phosphor-icons/react/DownloadSimple";
import { Button } from "./Button";


interface DownloadCsvButtonProps {
  onDownloadCsv: () => void;
}

export const DownloadCsvButton = ({ onDownloadCsv }: DownloadCsvButtonProps) => {
  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="h-10 px-4 gap-2 font-medium bg-gray-200/10 border-transparent text-gray-100 hover:bg-gray-200/20 hover:border-transparent"
      onClick={onDownloadCsv}
    >
      <DownloadSimpleIcon size={18} />
      Baixar CSV
    </Button>
  )
}