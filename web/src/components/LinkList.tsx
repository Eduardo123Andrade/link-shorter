import { DownloadCsvButton } from "./DownloadCsvButton";
import { EmptyList } from "./EmptyList";
import { LinkItem } from "./LinkItem";
import { Separator } from "./Separator";

import { useLinkStore } from "../store/linkStore";

interface LinkListProps {
  loading?: boolean;
}

export function LinkList({ loading }: LinkListProps) {
  const links = useLinkStore((state) => state.links);

  const hasLinks = links.length > 0;

  const onDownloadCsv = () => {
    // TODO: Implement CSV download
    console.log("download csv");
  };

  const LinkSkeleton = () => (
    <div className="flex w-full animate-pulse flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 w-full rounded-xl bg-white/5"
        />
      ))}
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/10 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="w-full text-xl font-semibold text-gray-100">
          Meus links
        </h2>
        <DownloadCsvButton 
          onDownloadCsv={onDownloadCsv} 
          disabled={!hasLinks || loading} 
        />
      </div>

      <Separator />

      {loading ? (
        <LinkSkeleton />
      ) : !hasLinks ? (
        <EmptyList />
      ) : (
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <LinkItem key={link.id} {...link} />
          ))}
        </div>
      )}
    </div>
  );
}
