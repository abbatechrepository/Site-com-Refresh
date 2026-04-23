import type { SeedContent, SeedSection } from "./types";

export const seedContentTypes = [
  {
    name: "Pagina editorial",
    slug: "pagina-editorial",
    description: "Tipo base para paginas e noticias",
    allowRichText: true,
    allowFeaturedMedia: true,
    schemaJson: {
      fields: ["title", "excerpt", "body", "seo"]
    }
  },
  {
    name: "Mascara institucional",
    slug: "mascara-institucional",
    description: "Estrutura para paginas de apresentacao e posicionamento.",
    allowRichText: true,
    allowFeaturedMedia: true,
    schemaJson: {
      fields: ["title", "excerpt", "body", "highlights", "seo"]
    }
  },
  {
    name: "Mascara de case",
    slug: "mascara-case",
    description: "Estrutura orientada a desafios, entregas e resultados.",
    allowRichText: true,
    allowFeaturedMedia: true,
    schemaJson: {
      fields: ["title", "challenge", "solution", "result", "seo"]
    }
  },
  {
    name: "Mascara documental",
    slug: "mascara-documental",
    description: "Estrutura para guias, notas tecnicas e materiais de apoio.",
    allowRichText: true,
    allowFeaturedMedia: false,
    schemaJson: {
      fields: ["title", "summary", "body", "attachments", "seo"]
    }
  }
] as const;

export const seedTemplates = [
  {
    name: "Pagina padrao",
    slug: "pagina-padrao",
    description: "Template base para o portal",
    componentKey: "default-page",
    configSchema: { layout: "default" }
  },
  {
    name: "Lista noticias",
    slug: "lista-noticias",
    description: "Template de listagem de noticias",
    componentKey: "news-list",
    configSchema: { layout: "list" }
  },
  {
    name: "Interna detalhe",
    slug: "interna-detalhe",
    description: "Template interno de detalhe",
    componentKey: "detail-page",
    configSchema: { layout: "detail" }
  }
] as const;

export const seedElements = [
  {
    name: "Barra de progresso",
    thumbLabel: "Web Design",
    content: "<div class='progress-bars'>Barra de progresso</div>",
    status: "active",
    category: "Destaques"
  },
  {
    name: "Destaque Leia Mais",
    thumbLabel: "Leia Mais",
    content: "<div class='highlight-read-more'>Leia mais</div>",
    status: "active",
    category: "Destaques"
  },
  {
    name: "Galeria Carrossel",
    thumbLabel: "Galeria Carrossel",
    content: "<div class='gallery-carousel'>Galeria</div>",
    status: "inactive",
    category: "Galeria de Imagens"
  }
] as const;

export const sections: SeedSection[] = [
  {
    name: "Institucional",
    slug: "institucional",
    description: "Paginas institucionais e posicionamento da empresa.",
    order: 1
  },
  {
    name: "Sobre",
    slug: "sobre",
    description: "Historia, proposta e contexto institucional.",
    order: 1,
    parentSlug: "institucional"
  },
  {
    name: "Servicos",
    slug: "servicos",
    description: "Linhas de atuacao e entregas centrais.",
    order: 2,
    parentSlug: "institucional"
  },
  {
    name: "Noticias",
    slug: "noticias",
    description: "Novidades, comunicados e anuncios do time.",
    order: 2
  },
  {
    name: "Cases",
    slug: "cases",
    description: "Resultados entregues e historias de projeto.",
    order: 3
  },
  {
    name: "Documentos",
    slug: "documentos",
    description: "Materiais de apoio, downloads e documentos institucionais.",
    order: 4
  }
];

export const visitSeeds = new Map([
  ["institucional", 148],
  ["sobre", 92],
  ["servicos", 134],
  ["noticias", 716],
  ["cases", 87],
  ["documentos", 56]
]);

export const contents: SeedContent[] = [
  {
    title: "Nova plataforma Abbatech",
    slug: "nova-plataforma-abbatech",
    excerpt: "A plataforma Abbatech opera com API, CMS e publicacao editorial integrada.",
    body: [
      "A Abbatech agora conta com uma base moderna separando portal, CMS e API.",
      "Este conteudo inicial foi criado automaticamente para validar o fluxo editorial.",
      "A partir daqui, o time pode cadastrar novas secoes e publicar novos materiais."
    ],
    sectionSlug: "noticias",
    contentTypeSlug: "pagina-editorial",
    seoDescription: "Portal reconstruido com CMS moderno, SEO e governanca editorial.",
    keywords: "abbatech, portal, cms, refresh"
  },
  {
    title: "Como estruturamos o Refresh para o time editorial",
    slug: "estrutura-refresh-time-editorial",
    excerpt: "Uma visao rapida do fluxo entre autenticacao, gestao de secoes e publicacao de conteudos.",
    body: [
      "O Refresh foi desenhado para separar operacao editorial, API e experiencia publica com uma base modular.",
      "No ambiente atual, a equipe consegue autenticar, cadastrar secoes, editar publicacoes e validar o reflexo imediato no portal.",
      "Esse desenho reduz acoplamento, facilita evolucao do front e cria uma base mais segura para futuros modulos."
    ],
    sectionSlug: "noticias",
    contentTypeSlug: "pagina-editorial",
    seoDescription: "Fluxo editorial do Refresh e da nova arquitetura da Abbatech.",
    keywords: "refresh, editorial, cms, arquitetura"
  },
  {
    title: "Quem somos",
    slug: "quem-somos",
    excerpt: "A Abbatech combina estrategia, produto e implementacao para projetos digitais com necessidade de escala.",
    body: [
      "Somos um time orientado a resolver operacao e produto com uma base tecnica que suporta crescimento.",
      "Atuamos em projetos que exigem clareza de dominio, automacao e experiencia digital consistente.",
      "A nova plataforma nasce para refletir essa mesma filosofia internamente."
    ],
    sectionSlug: "sobre",
    contentTypeSlug: "mascara-institucional",
    seoDescription: "Apresentacao institucional da Abbatech e da proposta da nova plataforma.",
    keywords: "abbatech, institucional, sobre, empresa"
  },
  {
    title: "Linhas de servico da Abbatech",
    slug: "linhas-de-servico-abbatech",
    excerpt: "Consultoria, evolucao de produto e operacao digital com foco em implementacao pragmatica.",
    body: [
      "A Abbatech atua com diagnostico, estruturacao de fluxos, desenvolvimento de sistemas e modernizacao de experiencia digital.",
      "Nosso foco e tirar a operacao do improviso e levar o time para uma base mais governavel.",
      "Esse portal novo serve tambem como demonstracao da forma como desenhamos produtos internos e externos."
    ],
    sectionSlug: "servicos",
    contentTypeSlug: "mascara-institucional",
    seoDescription: "Resumo das principais linhas de servico da Abbatech.",
    keywords: "servicos, consultoria, produto, operacao digital"
  },
  {
    title: "Caso de modernizacao de CMS e portal",
    slug: "caso-modernizacao-cms-portal",
    excerpt: "Uma entrega focada em organizar API e camada de experiencia com continuidade operacional.",
    body: [
      "Neste caso, o objetivo era estruturar a base com separacao clara entre dominios e interfaces.",
      "A solucao envolveu um CMS administrativo novo, API centralizada, mapeamento de dominio e infraestrutura preparada para evolucao.",
      "O resultado e uma fundacao mais segura para SEO, publicacao e governanca editorial."
    ],
    sectionSlug: "cases",
    contentTypeSlug: "mascara-case",
    seoDescription: "Exemplo de caso de modernizacao de CMS, API e portal.",
    keywords: "case, cms, modernizacao, portal"
  },
  {
    title: "Guia rapido do portal e do CMS",
    slug: "guia-rapido-portal-cms",
    excerpt: "Documento inicial para orientar demonstracao interna e validacao da plataforma.",
    body: [
      "Use o Refresh para entrar com o usuario seedado, cadastrar secoes e criar novos conteudos.",
      "O portal consome automaticamente os conteudos publicados e os apresenta na home e na pagina de detalhe.",
      "Esse fluxo serve como base para homologacao visual e para priorizacao das proximas entregas."
    ],
    sectionSlug: "documentos",
    contentTypeSlug: "mascara-documental",
    seoDescription: "Guia inicial de uso do portal e do CMS Refresh.",
    keywords: "guia, portal, cms, mvp"
  }
];
