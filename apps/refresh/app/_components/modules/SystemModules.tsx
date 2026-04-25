"use client";

import { ActionButton } from "../ActionButton";
import {
  emptyApplicationForm,
  emptyNewsletterCampaignForm,
  emptyNewsletterGroupForm,
  emptyNewsletterRecipientForm,
  emptySystemEmailForm
} from "../../_lib/constants";
import { displayRecordCode, formatDateTime } from "../../_lib/utils";
import type { RefreshManager } from "./moduleTypes";

export function SystemModules({ manager }: { manager: RefreshManager }) {
  const {
    view,
    applicationForm,
    setApplicationForm,
    handleApplicationSubmit,
    editApplication,
    management,
    removeEntity,
    systemEmailForm,
    setSystemEmailForm,
    handleSystemEmailSubmit,
    editSystemEmail,
    newsletterGroupForm,
    setNewsletterGroupForm,
    handleNewsletterGroupSubmit,
    editNewsletterGroup,
    newsletterRecipientForm,
    setNewsletterRecipientForm,
    handleNewsletterRecipientSubmit,
    editNewsletterRecipient,
    newsletterCampaignForm,
    setNewsletterCampaignForm,
    handleNewsletterCampaignSubmit,
    editNewsletterCampaign,
    resetStatistics,
    sections,
    contents
  } = manager;
    if (view === "applications") {
      return (
        <section className="space-y-6">
          <p className="text-[16px] leading-8 text-[#4b4b4b]">
            Cadastro de aplicativos, posicionamento nos menus e referência de link para as páginas do sistema.
          </p>
          <form className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" onSubmit={handleApplicationSubmit}>
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="admin-label">Aplicativo</label>
                <input
                  className="admin-input"
                  onChange={(event) => setApplicationForm((current) => ({ ...current, name: event.target.value }))}
                  value={applicationForm.name}
                />
              </div>
              <div>
                <label className="admin-label">Área</label>
                <input
                  className="admin-input"
                  onChange={(event) => setApplicationForm((current) => ({ ...current, area: event.target.value }))}
                  value={applicationForm.area}
                />
              </div>
              <div>
                <label className="admin-label">Link</label>
                <input
                  className="admin-input"
                  onChange={(event) => setApplicationForm((current) => ({ ...current, link: event.target.value }))}
                  value={applicationForm.link}
                />
              </div>
              <div className="flex items-end gap-2">
                <ActionButton tone="green" type="submit">
                  {applicationForm.id ? "Salvar" : "Incluir"}
                </ActionButton>
                <ActionButton onClick={() => setApplicationForm(emptyApplicationForm)}>Novo</ActionButton>
              </div>
            </div>
            <div>
              <label className="admin-label">Descrição</label>
              <textarea
                className="admin-textarea min-h-[90px]"
                onChange={(event) => setApplicationForm((current) => ({ ...current, description: event.target.value }))}
                value={applicationForm.description}
              />
            </div>
          </form>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[90px]">Id</th>
                  <th>Aplicativo</th>
                  <th>Área</th>
                  <th>Link</th>
                  <th>Descrição</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {management.applications.map((application) => (
                  <tr key={application.id}>
                    <td>{displayRecordCode(application.legacyId, application.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => editApplication(application)} type="button">
                        {application.name}
                      </button>
                    </td>
                    <td>{application.area}</td>
                    <td className="text-[#0c67ad]">{application.link}</td>
                    <td>{application.description ?? ""}</td>
                    <td>
                      <button className="text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/applications/${application.id}`, "Aplicativo excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (view === "emails") {
      return (
        <section className="space-y-6">
          <p className="text-[16px] leading-8 text-[#4b4b4b]">
            Aqui estão listados todos os e-mails utilizados pelo portal em contato, newsletter, inscrições e demais aplicações.
          </p>
          <form className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" onSubmit={handleSystemEmailSubmit}>
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="admin-label">Nome</label>
                <input className="admin-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, name: event.target.value }))} value={systemEmailForm.name} />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input className="admin-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, email: event.target.value }))} value={systemEmailForm.email} />
              </div>
              <div>
                <label className="admin-label">Área</label>
                <input className="admin-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, area: event.target.value }))} value={systemEmailForm.area} />
              </div>
              <div>
                <label className="admin-label">Valor</label>
                <input className="admin-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, value: event.target.value }))} value={systemEmailForm.value} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <label className="admin-label">Descrição</label>
                <textarea className="admin-textarea min-h-[90px]" onChange={(event) => setSystemEmailForm((current) => ({ ...current, description: event.target.value }))} value={systemEmailForm.description} />
              </div>
              <div className="flex items-end gap-2">
                <ActionButton tone="green" type="submit">
                  {systemEmailForm.id ? "Salvar" : "Incluir"}
                </ActionButton>
                <ActionButton onClick={() => setSystemEmailForm(emptySystemEmailForm)}>Novo</ActionButton>
              </div>
            </div>
          </form>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[90px]">Id</th>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Área</th>
                  <th>Descrição</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {management.systemEmails.map((systemEmail) => (
                  <tr key={systemEmail.id}>
                    <td>{displayRecordCode(systemEmail.legacyId, systemEmail.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => editSystemEmail(systemEmail)} type="button">
                        {systemEmail.name}
                      </button>
                    </td>
                    <td className="text-[#0c67ad]">{systemEmail.email}</td>
                    <td>{systemEmail.area}</td>
                    <td>{systemEmail.description ?? ""}</td>
                    <td>
                      <button className="text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/system-emails/${systemEmail.id}`, "Email excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (view === "statistics") {
      const statisticRows = [...sections].sort((left, right) => (right.visits ?? 0) - (left.visits ?? 0));

      return (
        <section className="space-y-6">
          <p className="text-[16px] leading-8 text-[#4b4b4b]">
            Estatística resumida de acesso por navegação em seção. Clique em zerar estatística para recomeçar a contagem.
          </p>
          <div className="flex flex-wrap gap-2">
            <ActionButton tone="red" onClick={() => void resetStatistics()}>
              Zerar TODAS as Estatísticas
            </ActionButton>
          </div>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[90px]">Id</th>
                  <th>Seção</th>
                  <th>Caminho</th>
                  <th>Visitas</th>
                </tr>
              </thead>
              <tbody>
                {statisticRows.map((section) => (
                  <tr key={section.id}>
                    <td>{displayRecordCode(section.legacyId, section.id)}</td>
                    <td>{section.name}</td>
                    <td className="text-[#0c67ad]">{section.path}</td>
                    <td>{section.visits ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (view === "newsletter") {
      return (
        <section className="space-y-6">
          <form className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" onSubmit={handleNewsletterGroupSubmit}>
            <div className="grid gap-4 lg:grid-cols-[1fr_2fr_auto]">
              <div>
                <label className="admin-label">Grupo</label>
                <input
                  className="admin-input"
                  onChange={(event) => setNewsletterGroupForm((current) => ({ ...current, name: event.target.value }))}
                  value={newsletterGroupForm.name}
                />
              </div>
              <div>
                <label className="admin-label">Descrição</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterGroupForm((current) => ({ ...current, description: event.target.value }))
                  }
                  value={newsletterGroupForm.description}
                />
              </div>
              <div className="flex items-end gap-2">
                <ActionButton tone="green" type="submit">
                  {newsletterGroupForm.id ? "Salvar" : "Incluir"}
                </ActionButton>
                <ActionButton onClick={() => setNewsletterGroupForm(emptyNewsletterGroupForm)}>Novo</ActionButton>
              </div>
            </div>
          </form>
          <form className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" onSubmit={handleNewsletterRecipientSubmit}>
            <div className="grid gap-4 lg:grid-cols-5">
              <div>
                <label className="admin-label">E-mail</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterRecipientForm((current) => ({ ...current, email: event.target.value }))
                  }
                  type="email"
                  value={newsletterRecipientForm.email}
                />
              </div>
              <div>
                <label className="admin-label">Nome</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterRecipientForm((current) => ({ ...current, name: event.target.value }))
                  }
                  value={newsletterRecipientForm.name}
                />
              </div>
              <div>
                <label className="admin-label">Grupo</label>
                <select
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterRecipientForm((current) => ({ ...current, groupId: event.target.value }))
                  }
                  value={newsletterRecipientForm.groupId}
                >
                  <option value="">Selecione</option>
                  {management.newsletterGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Consentimento</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterRecipientForm((current) => ({ ...current, consentAt: event.target.value }))
                  }
                  type="datetime-local"
                  value={newsletterRecipientForm.consentAt}
                />
              </div>
              <div className="flex items-end gap-2">
                <ActionButton tone="green" type="submit">
                  {newsletterRecipientForm.id ? "Salvar" : "Incluir"}
                </ActionButton>
                <ActionButton onClick={() => setNewsletterRecipientForm(emptyNewsletterRecipientForm)}>Novo</ActionButton>
              </div>
            </div>
            <div>
              <label className="admin-label">Descadastro</label>
              <input
                className="admin-input max-w-[320px]"
                onChange={(event) =>
                  setNewsletterRecipientForm((current) => ({ ...current, unsubscribedAt: event.target.value }))
                }
                type="datetime-local"
                value={newsletterRecipientForm.unsubscribedAt}
              />
            </div>
          </form>
          <form className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" onSubmit={handleNewsletterCampaignSubmit}>
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="admin-label">Campanha</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, name: event.target.value }))
                  }
                  value={newsletterCampaignForm.name}
                />
              </div>
              <div>
                <label className="admin-label">Assunto</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, subject: event.target.value }))
                  }
                  value={newsletterCampaignForm.subject}
                />
              </div>
              <div>
                <label className="admin-label">Remetente</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, senderName: event.target.value }))
                  }
                  value={newsletterCampaignForm.senderName}
                />
              </div>
              <div>
                <label className="admin-label">E-mail remetente</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, senderEmail: event.target.value }))
                  }
                  type="email"
                  value={newsletterCampaignForm.senderEmail}
                />
              </div>
              <div>
                <label className="admin-label">Status</label>
                <select
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, status: event.target.value }))
                  }
                  value={newsletterCampaignForm.status}
                >
                  <option value="draft">Rascunho</option>
                  <option value="scheduled">Agendada</option>
                  <option value="sent">Enviada</option>
                  <option value="archived">Arquivada</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Grupo</label>
                <select
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, recipientGroupId: event.target.value }))
                  }
                  value={newsletterCampaignForm.recipientGroupId}
                >
                  <option value="">Sem grupo</option>
                  {management.newsletterGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Agendamento</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, scheduledAt: event.target.value }))
                  }
                  type="datetime-local"
                  value={newsletterCampaignForm.scheduledAt}
                />
              </div>
              <div>
                <label className="admin-label">Envio</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, sentAt: event.target.value }))
                  }
                  type="datetime-local"
                  value={newsletterCampaignForm.sentAt}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="admin-label">HTML</label>
                <textarea
                  className="admin-textarea min-h-[130px]"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, bodyHtml: event.target.value }))
                  }
                  value={newsletterCampaignForm.bodyHtml}
                />
              </div>
              <div>
                <label className="admin-label">Texto</label>
                <textarea
                  className="admin-textarea min-h-[130px]"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, bodyText: event.target.value }))
                  }
                  value={newsletterCampaignForm.bodyText}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <ActionButton tone="green" type="submit">
                {newsletterCampaignForm.id ? "Salvar campanha" : "Incluir campanha"}
              </ActionButton>
              <ActionButton onClick={() => setNewsletterCampaignForm(emptyNewsletterCampaignForm)}>Nova campanha</ActionButton>
            </div>
          </form>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[90px]">Id</th>
                  <th>Grupo</th>
                  <th>Descrição</th>
                  <th>Destinatários</th>
                  <th>Campanhas</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {management.newsletterGroups.map((group) => (
                  <tr key={group.id}>
                    <td>{displayRecordCode(group.legacyId, group.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => editNewsletterGroup(group)} type="button">
                        {group.name}
                      </button>
                    </td>
                    <td>{group.description ?? ""}</td>
                    <td>{group._count.recipients}</td>
                    <td>{group._count.campaigns}</td>
                    <td>
                      <button className="text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/newsletter-groups/${group.id}`, "Grupo excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[90px]">Id</th>
                  <th>Destinatário</th>
                  <th>E-mail</th>
                  <th>Grupo</th>
                  <th>Consentimento</th>
                  <th>Descadastro</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {management.newsletterRecipients.map((recipient) => (
                  <tr key={recipient.id}>
                    <td>{displayRecordCode(recipient.legacyId, recipient.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => editNewsletterRecipient(recipient)} type="button">
                        {recipient.name ?? "--"}
                      </button>
                    </td>
                    <td>{recipient.email}</td>
                    <td>{recipient.groupName}</td>
                    <td>{formatDateTime(recipient.consentAt)}</td>
                    <td>{formatDateTime(recipient.unsubscribedAt)}</td>
                    <td>
                      <button className="text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/newsletter-recipients/${recipient.id}`, "Destinatário excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[90px]">Id</th>
                  <th>Campanha</th>
                  <th>Assunto</th>
                  <th>Remetente</th>
                  <th>Grupo</th>
                  <th>Status</th>
                  <th>Agendamento</th>
                  <th>Disparos</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {management.newsletterCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>{displayRecordCode(campaign.legacyId, campaign.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => editNewsletterCampaign(campaign)} type="button">
                        {campaign.name}
                      </button>
                    </td>
                    <td>{campaign.subject}</td>
                    <td>{campaign.senderEmail}</td>
                    <td>{campaign.recipientGroup?.name ?? "Sem grupo"}</td>
                    <td>{campaign.status}</td>
                    <td>{formatDateTime(campaign.scheduledAt)}</td>
                    <td>{campaign._count.dispatches}</td>
                    <td>
                      <button className="text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/newsletter-campaigns/${campaign.id}`, "Campanha excluída com sucesso.")} type="button">
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    return (
      <section className="space-y-6">
        <p className="text-[16px] leading-8 text-[#4b4b4b]">Visão inicial de estatísticas e contexto operacional do manager.</p>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="border border-[#ddd] bg-[#fafafa] p-6">
            <div className="text-[14px] uppercase tracking-[0.08em] text-[#777]">Conteúdos</div>
            <div className="mt-2 text-[44px] font-light text-[#111]">{contents.length}</div>
          </div>
          <div className="border border-[#ddd] bg-[#fafafa] p-6">
            <div className="text-[14px] uppercase tracking-[0.08em] text-[#777]">Usuários</div>
            <div className="mt-2 text-[44px] font-light text-[#111]">{management.users.length}</div>
          </div>
          <div className="border border-[#ddd] bg-[#fafafa] p-6">
            <div className="text-[14px] uppercase tracking-[0.08em] text-[#777]">LGPD</div>
            <div className="mt-2 text-[44px] font-light text-[#111]">{management.privacyRequests.length}</div>
          </div>
        </div>
      </section>
    );
}
