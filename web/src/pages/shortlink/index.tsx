import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogoIcon } from '@/components/LogoIcon';
import { useValidateLink } from '@/hooks/useValidateLink';
import { API_URL } from '@/lib/api';

export default function ShortLinkPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { loading, isValid } = useValidateLink(slug || '');

  useEffect(() => {
    if (!slug || loading) return;

    if (isValid === false) {
      navigate('/404', { replace: true });
      return;
    }

    if (isValid) {
      const timer = setTimeout(() => {
        window.location.href = `${API_URL}/${slug}`;
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [slug, loading, isValid, navigate]);

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
            href={`${API_URL}/${slug}`}
            className="text-blue-base font-medium hover:underline"
          >
            Acesse aqui
          </a>
        </p>
      </main>
    </div>
  );
}
