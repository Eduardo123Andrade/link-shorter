import Link from "next/link";

interface ShortLinkProps {
  shortUrl: string;
}

export const ShortLink = ({ shortUrl }: ShortLinkProps) => {
  return (
    <Link
      href={`/${shortUrl}`}
      target="_blank"
      className="text-blue-base font-bold text-lg hover:underline truncate block w-full"
    >
      {shortUrl}
    </Link>
  );
};