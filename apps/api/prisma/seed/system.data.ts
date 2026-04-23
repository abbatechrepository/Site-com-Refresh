export const systemEmails = [
  {
    name: "Central de Atendimento",
    email: "contato@abbatech.local",
    area: "Contato",
    description: "Endereço principal para relacionamento com o usuário.",
    value: "portal"
  },
  {
    name: "Newsletter Abbatech",
    email: "newsletter@abbatech.local",
    area: "Newsletter",
    description: "Remetente padrão para campanhas editoriais.",
    value: "newsletter"
  },
  {
    name: "RH Interno",
    email: "rh@abbatech.local",
    area: "RH",
    description: "Comunicação de pessoas e processos internos.",
    value: "interno"
  }
] as const;

export function createSeedUsers(adminEmail: string, adminPassword: string) {
  return [
    {
      name: "Administrador Abbatech",
      email: adminEmail,
      username: "felipe",
      cpf: "11111111111",
      password: adminPassword,
      isSuperAdmin: true,
      roleNames: ["Administrador", "Desenvolvedor", "Publicador Geral"]
    },
    {
      name: "Paula Conteudo",
      email: "conteudo@abbatech.local",
      username: "conteudo",
      cpf: "22222222222",
      password: "Refresh123!",
      isSuperAdmin: false,
      roleNames: ["Editor"]
    },
    {
      name: "Marcos Marketing",
      email: "marketing@abbatech.local",
      username: "marketing",
      cpf: "33333333333",
      password: "Refresh123!",
      isSuperAdmin: false,
      roleNames: ["Marketing"]
    },
    {
      name: "Livia Privacidade",
      email: "lgpd@abbatech.local",
      username: "lgpd",
      cpf: "44444444444",
      password: "Refresh123!",
      isSuperAdmin: false,
      roleNames: ["LGPD"]
    }
  ] as const;
}
