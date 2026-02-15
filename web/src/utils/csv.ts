import { IShortLink } from "../interfaces";

export const generateCsv = (data: IShortLink[]) => {
  const headers = ['ID', 'Link Original', 'Link Encurtado', 'Acessos'];
  
  const rows = data.map(item => [
    item.id,
    item.originalUrl,
    item.shortUrl,
    item.accessCount.toString()
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCsv = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
