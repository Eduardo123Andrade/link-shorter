import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../lib/api';

export function useValidateLink(shortLink: string | undefined | string[]) {
  const [validating, setValidating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!shortLink) return;

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
          setValidating(false);
        } else {
          router.replace('/404');
        }
      } catch {
        router.replace('/404');
      }
    };

    validate();
  }, [shortLink, router]);

  return { validating };
}
