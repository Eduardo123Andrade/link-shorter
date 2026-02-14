import { useState } from 'react';
import { useLinkStore } from '../store/linkStore';

export function useCreateLink() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLink = useLinkStore((state) => state.addLink);

  const handleSubmit = async () => {
    if (!originalUrl) {
      setError('Original URL is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newLink = {
        id: crypto.randomUUID(),
        shortUrl: customSuffix,
        originalUrl,
        accessCount: 0,
      };

      addLink(newLink);
      
      setOriginalUrl('');
      setCustomSuffix('');
      
    } catch (err) {
      setError('Failed to create link');
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
