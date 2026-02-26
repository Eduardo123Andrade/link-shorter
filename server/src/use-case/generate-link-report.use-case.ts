import { uuidv7 } from 'uuidv7';
import { LinkShorterRepository } from '../repository/link-shorter.repository';
import { storageService } from '../lib/storage';

type Link = {
  id: string;
  link: string;
  shortLink: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
};

const BATCH_SIZE = 10;
const CSV_HEADER = 'id,link,shortLink,accessCount,createdAt,updatedAt';

const rowToCsv = (l: Link) =>
  `"${l.id}","${l.link}","${l.shortLink}",${l.accessCount},"${l.createdAt.toISOString()}","${l.updatedAt.toISOString()}"`;

export const generateLinkReport = async (): Promise<{ url: string }> => {
  let cursor: string | undefined;
  const rows: string[] = [CSV_HEADER];

  while (true) {
    const batch = await LinkShorterRepository.listBatch(cursor, BATCH_SIZE);
    if (batch.length === 0) break;
    rows.push(...batch.map(rowToCsv));
    cursor = batch[batch.length - 1].id;
    if (batch.length < BATCH_SIZE) break;
    console.log('Batch processed', cursor);
  }

  const key = `reports/${uuidv7()}.csv`;
  const url = await storageService.upload(key, rows.join('\n'), {
    contentType: 'text/csv',
    contentDisposition: 'attachment; filename="links-report.csv"',
  });

  return { url };
};
