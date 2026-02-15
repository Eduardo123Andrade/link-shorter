import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { API_URL } from '../lib/api';
import { LogoIcon } from '@/components/LogoIcon';
import { useValidateLink } from '@/hooks/useValidateLink';

export default function ShortLinkPage() {
  const router = useRouter();
  const { shortLink } = router.query;
  const { validating } = useValidateLink(shortLink);

  useEffect(() => {
    if (!shortLink || validating) return;

    const timer = setTimeout(() => {
      window.location.href = `${API_URL}/${shortLink}`;
    }, 3000);

    return () => clearTimeout(timer);
  }, [shortLink, validating]);

  if (validating) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 font-sans text-gray-100">
      <main className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-2xl bg-white/5 ring-1 ring-white/10 px-8 py-14 text-center">
        <LogoIcon />

        <h1 className="text-2xl font-bold text-gray-100">
          Redirecionando...
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          O link sera aberto automaticamente em alguns instantes.
          <br />
          Nao foi redirecionado?{' '}
          <a
            href={`${API_URL}/${shortLink}`}
            className="text-blue-base font-medium hover:underline"
          >
            Acesse aqui
          </a>
        </p>
      </main>
    </div>
  );
}
