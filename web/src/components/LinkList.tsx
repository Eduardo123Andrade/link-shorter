import { DownloadCsvButton } from "./DownloadCsvButton";
import { EmptyList } from "./EmptyList";
import { LinkItem } from "./LinkItem";
import { Separator } from "./Separator";

interface ShortLink {
  id: string;
  shortUrl: string;
  originalUrl: string;
  accessCount: number;
}

export function LinkList() {
  const links: ShortLink[] = [
    {
      id: "1",
      shortUrl: "Portfolio-Dev",
      originalUrl: "https://devsite.portfolio.com.br/devname-123456",
      accessCount: 30,
    },
    {
      id: "2",
      shortUrl: "Rocketseat",
      originalUrl: "https://rocketseat.com.br",
      accessCount: 10,
    },
  ];
  const hasLinks = links.length > 0;

  const onDownloadCsv = () => {
    console.log("download csv");
  };

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/10 p-6">
      <div className="flex items-center justify-between">
        <h2 className="w-full text-xl font-semibold text-gray-100">
          Meus links
        </h2>
        <DownloadCsvButton onDownloadCsv={onDownloadCsv} />
      </div>

      <Separator />

      {!hasLinks ? (
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
