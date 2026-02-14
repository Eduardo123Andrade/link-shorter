import { DownloadCsvButton } from "./DownloadCsvButton";
import { EmptyList } from "./EmptyList";
import { Separator } from "./Separator";



export function LinkList() {
  const links = [];
  const hasLinks = links.length > 0;

  const onDownloadCsv = () => {
    console.log('download csv');
  }

  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl bg-white/10 p-6">
      <div className="flex items-center justify-between">
        <h2 className="w-full text-xl font-semibold text-gray-100">Meus links</h2>
        <DownloadCsvButton onDownloadCsv={onDownloadCsv} />
      </div>

      <Separator />

      {!hasLinks ? (
        <EmptyList />
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-gray-400">Listagem de links...</p>
        </div>
      )}
    </div>
  );
}
