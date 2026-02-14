import { useState } from 'react';

export function useCreateLink() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSuffix, setCustomSuffix] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock success
      console.log('Creating link:', { originalUrl, customSuffix });
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
