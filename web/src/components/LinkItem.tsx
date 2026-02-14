import { CopyIcon } from "@phosphor-icons/react/Copy";
import { TrashIcon } from "@phosphor-icons/react/Trash";
import { IconButton } from "./IconButton";
import { ShortLink } from "./ShortLink";
import { useLinkStore } from "../store/linkStore";

const API_URL = "http://localhost:3333";

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
  const removeLink = useLinkStore((state) => state.removeLink);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  const onDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/links/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete link");
      }

      removeLink(id);
    } catch (err) {
      console.error("Failed to delete link:", err);
    }
  };

  return (
    <div className="group flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-white/10">
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
          <IconButton onClick={onDelete} Icon={TrashIcon} title="Excluir link" />
        </div>
      </div>
    </div>
  );
}
