import { DownloadSimpleIcon } from "@phosphor-icons/react/DownloadSimple";
import { Button } from "./Button";


interface DownloadCsvButtonProps {
  onDownloadCsv: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const DownloadCsvButton = ({ onDownloadCsv, disabled, loading }: DownloadCsvButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-10 gap-2 w-auto bg-gray-200 px-4 font-medium text-gray-500 hover:border-transparent hover:bg-gray-300"
      onClick={onDownloadCsv}
      disabled={disabled}
      loading={loading}
    >
      <DownloadSimpleIcon size={18} />
      Baixar CSV
    </Button>
  )
}