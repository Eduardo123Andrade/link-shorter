interface ShortLinkProps {
  shortUrl: string;
}

export const ShortLink = ({ shortUrl }: ShortLinkProps) => {
  return (
    <a
      href={shortUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-base font-bold text-lg hover:underline truncate block w-full"
    >
      {shortUrl}
    </a>
  );
};
