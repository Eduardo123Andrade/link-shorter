import { useEffect, useState } from 'react';
import { API_URL } from '../lib/api';

export function useValidateLink(shortLink: string | undefined | string[]) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!shortLink) {
      setLoading(false);
      return;
    }

    const validate = async () => {
      try {
        const url = Array.isArray(shortLink) ? shortLink[0] : shortLink;
        const response = await fetch(`${API_URL}/${url}`, {
          method: 'GET',
          redirect: 'manual',
          headers: { Purpose: 'prefetch' },
        });

        if (
          response.type === 'opaqueredirect' ||
          response.ok ||
          response.status === 302
        ) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validate();
  }, [shortLink]);

  return { loading, isValid };
}
