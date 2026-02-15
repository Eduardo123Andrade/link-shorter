import { CopyIcon } from "@phosphor-icons/react/Copy";
import { TrashIcon } from "@phosphor-icons/react/Trash";
import { IconButton } from "./IconButton";
import { ShortLink } from "./ShortLink";
import { toast } from "../lib/toast";
import { useDeleteLink } from "../hooks/useDeleteLink";

interface LinkItemProps {
  id: string;
  shortUrl: string;
  originalUrl: string;
  accessCount: number;
}

export function LinkItem({
  id,
  shortUrl,
  originalUrl,
  accessCount,
}: LinkItemProps) {
  const { deleteLink, loading } = useDeleteLink();

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.info({ 
      title: "Link copiado com sucesso",
      message: `o link ${shortUrl} foi copiado para a área de transferência!`
    });
  };

  const onDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este link?")) {
      await deleteLink(id);
    }
  };

  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <ShortLink shortUrl={shortUrl} />
        <span className="block w-full truncate text-sm text-gray-400">
          {originalUrl}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <span className="whitespace-nowrap text-sm font-medium text-gray-400">
          {accessCount} acesso{accessCount !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-2">
          <IconButton onClick={handleCopy} Icon={CopyIcon} title="Copiar link" />
          <IconButton 
            onClick={onDelete} 
            Icon={TrashIcon} 
            title="Excluir link" 
            disabled={loading}
            // className="hover:text-danger hover:border-danger hover:bg-danger/10"
          />
        </div>
      </div>
    </div>
  );
}
