import { notFound } from "next/navigation";
import Link from "next/link";
import { getContentBySlug } from "../../lib/api";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function ContentPage({ params }: PageProps) {
  let content: Awaited<ReturnType<typeof getContentBySlug>>;

  try {
    content = await getContentBySlug(params.slug);
  } catch {
    notFound();
  }

  const paragraphs = (content.body ?? "").split(/\n{2,}/).filter(Boolean);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold uppercase tracking-[0.24em] text-ember" href="/">
          Voltar ao portal
        </Link>

        <article className="mt-8 rounded-[2rem] border border-ink/10 bg-white/85 p-8 shadow-xl shadow-ink/5 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-pine">
            {content.section.name}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-ink">{content.title}</h1>
          <p className="mt-4 text-lg leading-8 text-ink/75">{content.excerpt}</p>

          <div className="mt-8 border-t border-ink/10 pt-8">
            {paragraphs.length > 0 ? (
              <div className="space-y-6 text-base leading-8 text-ink/85">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <p className="text-ink/70">Este conteudo ainda nao possui corpo textual.</p>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
