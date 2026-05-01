"use client";

import { useState } from "react";

import { ActionButton } from "../ActionButton";
import { AdminModal } from "../AdminModal";
import {
  emptyApplicationForm,
  emptyNewsletterCampaignForm,
  emptyNewsletterGroupForm,
  emptyNewsletterRecipientForm,
  emptySystemEmailForm
} from "../../_lib/constants";
import { displayRecordCode, formatDateTime } from "../../_lib/utils";
import type { RefreshManager } from "./moduleTypes";

type SystemModal = "application" | "email" | "newsletter-group" | "newsletter-recipient" | "newsletter-campaign";

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
  const [activeModal, setActiveModal] = useState<SystemModal | null>(null);

  function closeModal() {
    if (activeModal === "application") {
      setApplicationForm(emptyApplicationForm);
    }

    if (activeModal === "email") {
      setSystemEmailForm(emptySystemEmailForm);
    }

    if (activeModal === "newsletter-group") {
      setNewsletterGroupForm(emptyNewsletterGroupForm);
    }

    if (activeModal === "newsletter-recipient") {
      setNewsletterRecipientForm(emptyNewsletterRecipientForm);
    }

    if (activeModal === "newsletter-campaign") {
      setNewsletterCampaignForm(emptyNewsletterCampaignForm);
    }

    setActiveModal(null);
  }

  function openNewApplication() {
    setApplicationForm(emptyApplicationForm);
    setActiveModal("application");
  }

  function openEditApplication(application: (typeof management.applications)[number]) {
    editApplication(application);
    setActiveModal("application");
  }

  function openNewSystemEmail() {
    setSystemEmailForm(emptySystemEmailForm);
    setActiveModal("email");
  }

  function openEditSystemEmail(systemEmail: (typeof management.systemEmails)[number]) {
    editSystemEmail(systemEmail);
    setActiveModal("email");
  }

  function openNewNewsletterGroup() {
    setNewsletterGroupForm(emptyNewsletterGroupForm);
    setActiveModal("newsletter-group");
  }

  function openEditNewsletterGroup(group: (typeof management.newsletterGroups)[number]) {
    editNewsletterGroup(group);
    setActiveModal("newsletter-group");
  }

  function openNewNewsletterRecipient() {
    setNewsletterRecipientForm(emptyNewsletterRecipientForm);
    setActiveModal("newsletter-recipient");
  }

  function openEditNewsletterRecipient(recipient: (typeof management.newsletterRecipients)[number]) {
    editNewsletterRecipient(recipient);
    setActiveModal("newsletter-recipient");
  }

  function openNewNewsletterCampaign() {
    setNewsletterCampaignForm(emptyNewsletterCampaignForm);
    setActiveModal("newsletter-campaign");
  }

  function openEditNewsletterCampaign(campaign: (typeof management.newsletterCampaigns)[number]) {
    editNewsletterCampaign(campaign);
    setActiveModal("newsletter-campaign");
  }

  if (view === "applications") {
    return (
      <section className="space-y-6">
        <p className="admin-copy">
          Cadastro de aplicativos, posicionamento nos menus e referência de link para as páginas do sistema.
        </p>

        <div className="admin-toolbar">
          <ActionButton onClick={openNewApplication} tone="green">
            Incluir Aplicativo
          </ActionButton>
        </div>

        <div className="admin-table-panel overflow-x-auto">
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
                  <td>{displayRecordCode(application.displayId, application.id)}</td>
                  <td>
                    <button className="text-[#0c67ad] hover:underline" onClick={() => openEditApplication(application)} type="button">
                      {application.name}
                    </button>
                  </td>
                  <td>{application.area}</td>
                  <td className="text-[#0c67ad]">{application.link}</td>
                  <td>{application.description ?? ""}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button className="text-left text-[#0c67ad] hover:underline" onClick={() => openEditApplication(application)} type="button">
                        Editar
                      </button>
                      <button className="text-left text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/applications/${application.id}`, "Aplicativo excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal
          error={manager.error}
          isOpen={activeModal === "application"}
          onClose={closeModal}
          size="lg"
          title={applicationForm.id ? "Editar Aplicativo" : "Novo Aplicativo"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleApplicationSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
            <div className="grid gap-4 lg:grid-cols-3">
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
            </div>
            <div>
              <label className="admin-label">Descrição</label>
              <textarea
                className="admin-textarea min-h-[90px]"
                onChange={(event) => setApplicationForm((current) => ({ ...current, description: event.target.value }))}
                value={applicationForm.description}
              />
            </div>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {applicationForm.id ? "Salvar" : "Incluir"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>
      </section>
    );
  }

  if (view === "emails") {
    return (
      <section className="space-y-6">
        <p className="admin-copy">
          Aqui estão listados todos os e-mails utilizados pelo portal em contato, newsletter, inscrições e demais aplicações.
        </p>

        <div className="admin-toolbar">
          <ActionButton onClick={openNewSystemEmail} tone="green">
            Incluir Email
          </ActionButton>
        </div>

        <div className="admin-table-panel overflow-x-auto">
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
                  <td>{displayRecordCode(systemEmail.displayId, systemEmail.id)}</td>
                  <td>
                    <button className="text-[#0c67ad] hover:underline" onClick={() => openEditSystemEmail(systemEmail)} type="button">
                      {systemEmail.name}
                    </button>
                  </td>
                  <td className="text-[#0c67ad]">{systemEmail.email}</td>
                  <td>{systemEmail.area}</td>
                  <td>{systemEmail.description ?? ""}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button className="text-left text-[#0c67ad] hover:underline" onClick={() => openEditSystemEmail(systemEmail)} type="button">
                        Editar
                      </button>
                      <button className="text-left text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/system-emails/${systemEmail.id}`, "Email excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal
          error={manager.error}
          isOpen={activeModal === "email"}
          onClose={closeModal}
          size="lg"
          title={systemEmailForm.id ? "Editar Email" : "Novo Email"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleSystemEmailSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
            <div className="grid gap-4 lg:grid-cols-2">
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
            <div>
              <label className="admin-label">Descrição</label>
              <textarea className="admin-textarea min-h-[90px]" onChange={(event) => setSystemEmailForm((current) => ({ ...current, description: event.target.value }))} value={systemEmailForm.description} />
            </div>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {systemEmailForm.id ? "Salvar" : "Incluir"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>
      </section>
    );
  }

  if (view === "statistics") {
    const statisticRows = [...sections].sort((left, right) => (right.visits ?? 0) - (left.visits ?? 0));

    return (
      <section className="space-y-6">
        <p className="admin-copy">
          Estatística resumida de acesso por navegação em seção. Clique em zerar estatística para recomeçar a contagem.
        </p>
        <div className="admin-toolbar">
          <ActionButton tone="red" onClick={() => void resetStatistics()}>
            Zerar TODAS as Estatísticas
          </ActionButton>
        </div>
        <div className="admin-table-panel overflow-x-auto">
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
                  <td>{displayRecordCode(section.displayId, section.id)}</td>
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
        <div className="admin-toolbar">
          <ActionButton onClick={openNewNewsletterGroup} tone="green">
            Incluir Grupo
          </ActionButton>
          <ActionButton onClick={openNewNewsletterRecipient} tone="green">
            Incluir Destinatário
          </ActionButton>
          <ActionButton onClick={openNewNewsletterCampaign} tone="green">
            Incluir Campanha
          </ActionButton>
        </div>

        <div className="admin-table-panel overflow-x-auto">
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
                  <td>{displayRecordCode(group.displayId, group.id)}</td>
                  <td>
                    <button className="text-[#0c67ad] hover:underline" onClick={() => openEditNewsletterGroup(group)} type="button">
                      {group.name}
                    </button>
                  </td>
                  <td>{group.description ?? ""}</td>
                  <td>{group._count.recipients}</td>
                  <td>{group._count.campaigns}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button className="text-left text-[#0c67ad] hover:underline" onClick={() => openEditNewsletterGroup(group)} type="button">
                        Editar
                      </button>
                      <button className="text-left text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/newsletter-groups/${group.id}`, "Grupo excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-table-panel overflow-x-auto">
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
                  <td>{displayRecordCode(recipient.displayId, recipient.id)}</td>
                  <td>
                    <button className="text-[#0c67ad] hover:underline" onClick={() => openEditNewsletterRecipient(recipient)} type="button">
                      {recipient.name ?? "--"}
                    </button>
                  </td>
                  <td>{recipient.email}</td>
                  <td>{recipient.groupName}</td>
                  <td>{formatDateTime(recipient.consentAt)}</td>
                  <td>{formatDateTime(recipient.unsubscribedAt)}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button className="text-left text-[#0c67ad] hover:underline" onClick={() => openEditNewsletterRecipient(recipient)} type="button">
                        Editar
                      </button>
                      <button className="text-left text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/newsletter-recipients/${recipient.id}`, "Destinatário excluído com sucesso.")} type="button">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-table-panel overflow-x-auto">
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
                  <td>{displayRecordCode(campaign.displayId, campaign.id)}</td>
                  <td>
                    <button className="text-[#0c67ad] hover:underline" onClick={() => openEditNewsletterCampaign(campaign)} type="button">
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
                    <div className="flex flex-col gap-1">
                      <button className="text-left text-[#0c67ad] hover:underline" onClick={() => openEditNewsletterCampaign(campaign)} type="button">
                        Editar
                      </button>
                      <button className="text-left text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/newsletter-campaigns/${campaign.id}`, "Campanha excluída com sucesso.")} type="button">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal
          error={manager.error}
          isOpen={activeModal === "newsletter-group"}
          onClose={closeModal}
          size="lg"
          title={newsletterGroupForm.id ? "Editar Grupo" : "Novo Grupo"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleNewsletterGroupSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
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
            </div>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {newsletterGroupForm.id ? "Salvar" : "Incluir"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>

        <AdminModal
          error={manager.error}
          isOpen={activeModal === "newsletter-recipient"}
          onClose={closeModal}
          size="lg"
          title={newsletterRecipientForm.id ? "Editar Destinatário" : "Novo Destinatário"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleNewsletterRecipientSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
            <div className="grid gap-4 lg:grid-cols-2">
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
              <div>
                <label className="admin-label">Descadastro</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setNewsletterRecipientForm((current) => ({ ...current, unsubscribedAt: event.target.value }))
                  }
                  type="datetime-local"
                  value={newsletterRecipientForm.unsubscribedAt}
                />
              </div>
            </div>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {newsletterRecipientForm.id ? "Salvar" : "Incluir"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>

        <AdminModal
          error={manager.error}
          isOpen={activeModal === "newsletter-campaign"}
          onClose={closeModal}
          size="xl"
          title={newsletterCampaignForm.id ? "Editar Campanha" : "Nova Campanha"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleNewsletterCampaignSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
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
                  className="admin-textarea min-h-[160px]"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, bodyHtml: event.target.value }))
                  }
                  value={newsletterCampaignForm.bodyHtml}
                />
              </div>
              <div>
                <label className="admin-label">Texto</label>
                <textarea
                  className="admin-textarea min-h-[160px]"
                  onChange={(event) =>
                    setNewsletterCampaignForm((current) => ({ ...current, bodyText: event.target.value }))
                  }
                  value={newsletterCampaignForm.bodyText}
                />
              </div>
            </div>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {newsletterCampaignForm.id ? "Salvar campanha" : "Incluir campanha"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <p className="admin-copy">Visão inicial de estatísticas e contexto operacional do manager.</p>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="admin-card">
          <div className="text-[14px] uppercase tracking-[0.08em] text-[#777]">Conteúdos</div>
          <div className="mt-2 text-[40px] font-semibold text-[#10233d]">{contents.length}</div>
        </div>
        <div className="admin-card">
          <div className="text-[14px] uppercase tracking-[0.08em] text-[#777]">Usuários</div>
          <div className="mt-2 text-[40px] font-semibold text-[#10233d]">{management.users.length}</div>
        </div>
        <div className="admin-card">
          <div className="text-[14px] uppercase tracking-[0.08em] text-[#777]">LGPD</div>
          <div className="mt-2 text-[40px] font-semibold text-[#10233d]">{management.privacyRequests.length}</div>
        </div>
      </div>
    </section>
  );
}
