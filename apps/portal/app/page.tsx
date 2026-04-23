import Link from "next/link";
import { getPortalApiUrl, getPublishedContents, getSections } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, contents] = await Promise.all([getSections(), getPublishedContents()]);
  const featuredContent = contents[0];

  return (
    <main className="min-h-screen">
      <section className="border-b border-ink/10 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ember">Abbatech</p>
            <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">
              Portal conectado ao CMS Refresh
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              className="rounded-full bg-pine px-5 py-3 text-sm font-semibold text-white hover:bg-pine/90"
              href={process.env.NEXT_PUBLIC_REFRESH_URL ?? "http://localhost:3001"}
            >
              Abrir CMS
            </a>
            <a
              className="rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink hover:border-ink/30"
              href={getPortalApiUrl()}
            >
              Ver API
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[2rem] bg-pine p-8 text-white shadow-xl shadow-pine/15">
          <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80">
            Plataforma em operação
          </span>
          <h2 className="mt-6 font-serif text-5xl leading-tight">
            Conteudo publicado no Refresh agora aparece aqui no portal.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
            O fluxo editorial ja cobre autenticacao, secoes, publicacao de conteudo e renderizacao
            no site publico a partir da API.
          </p>
          {featuredContent ? (
            <div className="mt-8 rounded-[1.5rem] bg-white/10 p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-gold">Destaque inicial</p>
              <h3 className="mt-3 text-2xl font-semibold">{featuredContent.title}</h3>
              <p className="mt-3 text-white/78">{featuredContent.excerpt}</p>
              <Link
                className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-pine"
                href={`/${featuredContent.slug}`}
              >
                Ler publicacao
              </Link>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] bg-white/10 p-6 text-white/78">
              Nenhum conteudo publicado ainda.
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-ink/10 bg-white/80 p-8 shadow-xl shadow-ink/5 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ember">Secoes</p>
          <div className="mt-6 grid gap-4">
            {sections.map((section) => (
              <div key={section.id} className="rounded-2xl border border-ink/10 bg-mist px-5 py-4">
                <p className="font-medium text-ink">{section.name}</p>
                <p className="mt-1 text-sm text-ink/65">{section.path}</p>
                {section.children.length > 0 ? (
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-ember/80">
                    {section.children.length} subsecoes
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ember">
              Publicacoes recentes
            </p>
            <h2 className="mt-3 font-serif text-3xl text-ink">Conteudos publicados</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {contents.map((content) => (
            <article
              key={content.id}
              className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-sm shadow-ink/5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ember">
                {content.section.name}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-ink">{content.title}</h3>
              <p className="mt-3 min-h-20 text-sm leading-7 text-ink/72">{content.excerpt}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.24em] text-ink/45">
                  {content.publishedAt
                    ? new Date(content.publishedAt).toLocaleDateString("pt-BR")
                    : "Rascunho"}
                </span>
                <Link className="text-sm font-semibold text-pine" href={`/${content.slug}`}>
                  Abrir
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
