export const newsletterGroups = [
  {
    name: "Clientes ativos",
    description: "Lista base para comunicados voltados aos clientes em operacao."
  },
  {
    name: "Leads portal",
    description: "Interessados em conteudos, novidades e demonstracoes da plataforma."
  }
] as const;

export const newsletterRecipients = [
  {
    email: "contato@cliente-exemplo.com",
    name: "Contato Cliente Exemplo",
    groupName: "Clientes ativos"
  },
  {
    email: "time@empresa-parceira.com",
    name: "Time Empresa Parceira",
    groupName: "Clientes ativos"
  },
  {
    email: "lead@interessado.com",
    name: "Lead Interessado",
    groupName: "Leads portal"
  }
] as const;

export const launchCampaign = {
  name: "Lancamento do portal MVP",
  subject: "Novo portal Abbatech no ar",
  senderName: "Equipe Abbatech",
  senderEmail: "noreply@abbatech.local",
  bodyHtml: "<p>O novo portal Abbatech ja esta em demonstracao com CMS e API integrados.</p>",
  bodyText: "O novo portal Abbatech ja esta em demonstracao com CMS e API integrados.",
  status: "draft"
} as const;
