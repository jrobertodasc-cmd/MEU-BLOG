import Link from 'next/link';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PostParams {
  params: Promise<{
    id: string;
  }>;
}

// Gera os caminhos estáticos em tempo de build para performance máxima
export function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Post({ params }: PostParams) {
  try {
    const resolvedParams = await params;
    const postData = await getPostData(resolvedParams.id);

    return (
      <div className="min-h-screen bg-[#faf9f6] text-[#2b261f] font-sans selection:bg-[#eae3d5]">
        <div className="max-w-2xl mx-auto px-6 py-16">
          
          {/* Botão Voltar */}
          <nav className="mb-12">
            <Link 
              href="/" 
              className="inline-flex items-center text-xs font-medium text-[#7a6a53] hover:text-[#4a3f31] transition-colors duration-200"
            >
              ← Voltar para a Home
            </Link>
          </nav>

          {/* Cabeçalho do Artigo */}
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#4a3f31] leading-tight mb-4">
              {postData.title}
            </h1>
            <div className="text-xs text-[#9a8a73] font-mono">
              Publicado em:{' '}
              {new Date(postData.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
              })}
            </div>
          </header>

          {/* Conteúdo Renderizado do Markdown */}
          <main className="prose prose-stone prose-serif max-w-none text-[#2b261f] leading-relaxed text-justify
            prose-headings:font-serif prose-headings:font-normal prose-headings:text-[#4a3f31]
            prose-p:text-base prose-p:mb-6 prose-p:indent-4
            prose-blockquote:border-l-4 prose-blockquote:border-[#8c7355] prose-blockquote:bg-[#f1ede4] prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:pl-6 prose-blockquote:font-serif prose-blockquote:italic prose-blockquote:text-[#4a3f31] prose-blockquote:rounded-r
            prose-em:text-[#4a3f31]">
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml || "" }} />
          </main>

          {/* Divisor Final */}
          <div className="mt-16 pt-8 border-t border-[#e5dfd3] flex justify-between items-center text-xs text-[#9a8a73]">
            <span>Fim da reflexão.</span>
            <Link href="/" className="hover:underline text-[#8c7355]">
              Voltar ao topo
            </Link>
          </div>

        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
