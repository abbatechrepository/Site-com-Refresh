"use client";

import { LegacyButton } from "../LegacyButton";
import {
  emptyApplicationForm,
  emptySystemEmailForm
} from "../../_lib/constants";
import { displayRecordCode } from "../../_lib/utils";
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
                <label className="legacy-label">Aplicativo</label>
                <input
                  className="legacy-input"
                  onChange={(event) => setApplicationForm((current) => ({ ...current, name: event.target.value }))}
                  value={applicationForm.name}
                />
              </div>
              <div>
                <label className="legacy-label">Área</label>
                <input
                  className="legacy-input"
                  onChange={(event) => setApplicationForm((current) => ({ ...current, area: event.target.value }))}
                  value={applicationForm.area}
                />
              </div>
              <div>
                <label className="legacy-label">Link</label>
                <input
                  className="legacy-input"
                  onChange={(event) => setApplicationForm((current) => ({ ...current, link: event.target.value }))}
                  value={applicationForm.link}
                />
              </div>
              <div className="flex items-end gap-2">
                <LegacyButton tone="green" type="submit">
                  {applicationForm.id ? "Salvar" : "Incluir"}
                </LegacyButton>
                <LegacyButton onClick={() => setApplicationForm(emptyApplicationForm)}>Novo</LegacyButton>
              </div>
            </div>
            <div>
              <label className="legacy-label">Descrição</label>
              <textarea
                className="legacy-textarea min-h-[90px]"
                onChange={(event) => setApplicationForm((current) => ({ ...current, description: event.target.value }))}
                value={applicationForm.description}
              />
            </div>
          </form>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="legacy-table min-w-full">
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
                <label className="legacy-label">Nome</label>
                <input className="legacy-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, name: event.target.value }))} value={systemEmailForm.name} />
              </div>
              <div>
                <label className="legacy-label">Email</label>
                <input className="legacy-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, email: event.target.value }))} value={systemEmailForm.email} />
              </div>
              <div>
                <label className="legacy-label">Área</label>
                <input className="legacy-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, area: event.target.value }))} value={systemEmailForm.area} />
              </div>
              <div>
                <label className="legacy-label">Valor</label>
                <input className="legacy-input" onChange={(event) => setSystemEmailForm((current) => ({ ...current, value: event.target.value }))} value={systemEmailForm.value} />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <label className="legacy-label">Descrição</label>
                <textarea className="legacy-textarea min-h-[90px]" onChange={(event) => setSystemEmailForm((current) => ({ ...current, description: event.target.value }))} value={systemEmailForm.description} />
              </div>
              <div className="flex items-end gap-2">
                <LegacyButton tone="green" type="submit">
                  {systemEmailForm.id ? "Salvar" : "Incluir"}
                </LegacyButton>
                <LegacyButton onClick={() => setSystemEmailForm(emptySystemEmailForm)}>Novo</LegacyButton>
              </div>
            </div>
          </form>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="legacy-table min-w-full">
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
            <LegacyButton tone="red" onClick={() => void resetStatistics()}>
              Zerar TODAS as Estatísticas
            </LegacyButton>
          </div>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="legacy-table min-w-full">
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
          <div className="flex flex-wrap gap-2">
            <LegacyButton tone="green">Incluir</LegacyButton>
            <LegacyButton>Buscar</LegacyButton>
            <LegacyButton>Mudar Status</LegacyButton>
          </div>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="legacy-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[90px]">Id</th>
                  <th>Campanha</th>
                  <th>Assunto</th>
                  <th>Grupo</th>
                  <th>Status</th>
                  <th>Disparos</th>
                </tr>
              </thead>
              <tbody>
                {management.newsletterCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>{displayRecordCode(campaign.legacyId, campaign.id)}</td>
                    <td className="text-[#0c67ad]">{campaign.name}</td>
                    <td>{campaign.subject}</td>
                    <td>{campaign.recipientGroup?.name ?? "Sem grupo"}</td>
                    <td>{campaign.status}</td>
                    <td>{campaign._count.dispatches}</td>
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
