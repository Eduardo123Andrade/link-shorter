import Link from 'next/link';

const glitchLines = Array.from({ length: 8 }).map(() => ({
  width: 60 + Math.random() * 40,
  marginLeft: Math.random() * 20,
  opacity: 0.4 + Math.random() * 0.6,
}));

function Glitch404() {

  return (
    <div className="relative select-none" aria-hidden="true">
      <span className="text-[120px] font-black leading-none tracking-tight text-blue-base">
        404
      </span>
      <span className="absolute inset-0 text-[120px] font-black leading-none tracking-tight text-red-500 opacity-40"
        style={{ clipPath: 'inset(20% 0 40% 0)', transform: 'translateX(-4px)' }}>
        404
      </span>
      <span className="absolute inset-0 text-[120px] font-black leading-none tracking-tight text-red-500 opacity-40"
        style={{ clipPath: 'inset(55% 0 10% 0)', transform: 'translateX(4px)' }}>
        404
      </span>
      <span className="absolute inset-0 text-[120px] font-black leading-none tracking-tight text-blue-base opacity-30"
        style={{ clipPath: 'inset(35% 0 30% 0)', transform: 'translateX(6px)' }}>
        404
      </span>
      {/* Horizontal glitch lines */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden opacity-30">
        {glitchLines.map((style, i) => (
          <div
            key={i}
            className="h-[2px] bg-red-400"
            style={{
              width: `${style.width}%`,
              marginLeft: `${style.marginLeft}%`,
              opacity: style.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 font-sans text-gray-100">
      <main className="flex w-full max-w-[580px] flex-col items-center gap-6 rounded-2xl bg-white/5 ring-1 ring-white/10 px-8 py-14 text-center">
        <Glitch404 />

        <h1 className="text-2xl font-bold text-gray-100">
          Link nao encontrado
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          O link que voce esta tentando acessar nao existe, foi removido ou e
          uma URL invalida. Saiba mais em{' '}
          <Link href="/" className="text-blue-base font-medium underline hover:no-underline">
            brev.ly
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
