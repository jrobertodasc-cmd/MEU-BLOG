import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export const revalidate = 3600; // Opcional: Revalida o cache a cada hora

export default function Home() {
  const allPosts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#2b261f] font-sans selection:bg-[#eae3d5]">
      <main className="max-w-2xl mx-auto px-6 py-20">
        
        {/* Cabeçalho do Blog */}
        <header className="mb-16 border-b border-[#e5dfd3] pb-8">
          <h1 className="text-3xl font-serif font-normal tracking-wide text-[#4a3f31] mb-2">
            Reflexões & Ensaios
          </h1>
          <p className="text-sm text-[#7a6a53] italic">
            Pensamentos sobre fé, espiritualidade e a simplicidade do Evangelho.
          </p>
        </header>

        {/* Lista de Artigos */}
        <div className="space-y-12">
          {allPosts.map(({ id, date, title, excerpt }) => (
            <article key={id} className="group">
              <span className="text-xs tracking-wider text-[#9a8a73] font-mono">
                {new Date(date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'UTC'
                })}
              </span>
              
              <Link href={`/posts/${id}`} className="block mt-1">
                <h2 className="text-xl font-serif text-[#4a3f31] group-hover:text-[#8c7355] transition-colors duration-200 leading-snug">
                  {title}
                </h2>
              </Link>
              
              <p className="mt-3 text-sm text-[#5a5043] leading-relaxed line-clamp-3 text-justify">
                {excerpt}
              </p>
              
              <Link 
                href={`/posts/${id}`} 
                className="inline-block mt-4 text-xs font-medium text-[#8c7355] hover:underline"
              >
                Continuar lendo →
              </Link>
            </article>
          ))}
        </div>

        {/* Rodapé */}
        <footer className="mt-24 pt-8 border-t border-[#e5dfd3] text-center text-xs text-[#9a8a73]">
          &copy; {new Date().getFullYear()} — Feito de forma estática.
        </footer>
      </main>
    </div>
  );
}
