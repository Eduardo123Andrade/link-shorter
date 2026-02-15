import { useCallback, useEffect, useState } from 'react';
import { useLinkStore } from '../store/linkStore';
import { IShortLink } from '../interfaces';

import { API_URL } from '../lib/api';

interface ApiFetchLink {
  id: string;
  link: string;
  shortLink: string;
  accessCount: number;
}

export function useFetchLinks() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setLinks = useLinkStore((state) => state.setLinks);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/links`);

      if (!response.ok) {
        throw new Error('Falha ao buscar links');
      }

      const data: ApiFetchLink[] = await response.json();

      const links: IShortLink[] = data.map((item) => ({
        id: item.id,
        originalUrl: item.link,
        shortUrl: item.shortLink,
        accessCount: item.accessCount,
      }));

      setLinks(links);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao buscar links');
    } finally {
      setLoading(false);
    }
  }, [setLinks]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return { loading, error, fetchLinks };
}
