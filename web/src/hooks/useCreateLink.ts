import { useState } from 'react';
import { toast } from '../lib/toast';

import { API_URL } from '../lib/api';

export function useCreateLink(fetchLinks: () => Promise<void>) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!originalUrl) {
      setError('A URL original é obrigatória');
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
            : data.error || 'Falha ao criar o link';
        throw new Error(message);
      }

      await fetchLinks();

      setOriginalUrl('');
      setCustomSuffix('');
      toast.success('Link criado com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao criar o link';
      setError(message);
      toast.error(message);
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
