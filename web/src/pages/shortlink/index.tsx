import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LogoIcon } from '@/components/LogoIcon';
import { useValidateLink } from '@/hooks/useValidateLink';
import { API_URL } from '@/lib/api';

export default function ShortLinkPage() {
  const router = useRouter();
  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPath(window.location.pathname.substring(1));
  }, []);

  const { loading, isValid } = useValidateLink(path || '');

  useEffect(() => {
    if (!path || loading) return;

    if (isValid === false) {
      console.log('Invalid link');
      router.replace('/404');
      return;
    }

    if (isValid) {
      const timer = setTimeout(() => {
        window.location.href = `${API_URL}/${path}`;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [path, loading, isValid, router]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200 p-4 font-sans text-gray-600">
      <main className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-2xl bg-gray-100 px-8 py-14 text-center">
        <LogoIcon />

        <h1 className="text-2xl font-bold text-gray-600">
          Redirecionando...
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          O link sera aberto automaticamente em alguns instantes.
          <br />
          Nao foi redirecionado?{' '}
          <a
            href={`${API_URL}/${path}`}
            className="text-blue-base font-medium hover:underline"
          >
            Acesse aqui
          </a>
        </p>
      </main>
    </div>
  );
}
