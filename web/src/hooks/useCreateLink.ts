import { useState } from 'react';
import { useFetchLinks } from './useFetchLinks';

const API_URL = 'http://localhost:3333';

export function useCreateLink() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchLinks } = useFetchLinks();

  const handleSubmit = async () => {
    if (!originalUrl) {
      setError('Original URL is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: originalUrl, shortLink: customSuffix }),
      });

      if (!response.ok) {
        const data = await response.json();
        const message =
          data.errors
            ? Object.values(data.errors).flat().join(', ')
            : data.error || 'Failed to create link';
        throw new Error(message);
      }

      await fetchLinks();

      setOriginalUrl('');
      setCustomSuffix('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create link');
    } finally {
      setLoading(false);
    }
  };

  return {
    originalUrl,
    setOriginalUrl,
    customSuffix,
    setCustomSuffix,
    loading,
    error,
    handleSubmit,
  };
}
