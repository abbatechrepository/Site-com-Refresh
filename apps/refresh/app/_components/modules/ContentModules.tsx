"use client";

import { ActionButton } from "../ActionButton";
import { AdminModal } from "../AdminModal";
import { SectionTree } from "../SectionTree";
import { portalRootLabel, templateLibrary } from "../../_lib/constants";
import { displayRecordCode, formatContentStatus, formatDate, formatTime } from "../../_lib/utils";
import type { Content, ContentFormState, Section } from "../../_lib/types";
import type { RefreshManager } from "./moduleTypes";

function formatPathSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getSectionLabelChain(section: Content["section"], sections: Section[]) {
  const sectionMap = new Map(sections.map((entry) => [entry.id, entry]));
  const labels: string[] = [];
  const visited = new Set<string>();
  let current: Section | Content["section"] | undefined = sectionMap.get(section.id) ?? section;

  while (current && !visited.has(current.id)) {
    visited.add(current.id);
    labels.unshift(current.name);
    current = current.parentId ? sectionMap.get(current.parentId) : undefined;
  }

  if (labels.length > 0) {
    return labels;
  }

  const pathLabels = section.path?.split("/").filter(Boolean).map(formatPathSegment) ?? [];
  if (pathLabels.length > 0) {
    pathLabels[pathLabels.length - 1] = section.name;
    return pathLabels;
  }

  return [section.name];
}

function formatSectionBreadcrumb(section: Content["section"], sections: Section[]) {
  const sectionLabels = getSectionLabelChain(section, sections);
  const labels = sectionLabels[0]?.toLowerCase() === "home" ? sectionLabels : ["Home", ...sectionLabels];

  return `>${[portalRootLabel, ...labels].join(">")}`;
}

export function ContentModules({ manager }: { manager: RefreshManager }) {
  const {
    view,
    openNewContent,
    contents,
    selectContent,
    removeEntity,
    handleContentSubmit,
    setContentForm,
    contentForm,
    meta,
    sections,
    setView,
    sectionTree,
    openNewSection,
    editSection,
    handleSectionSubmit,
    sectionForm,
    setSectionForm
  } = manager;

  const isContentModalOpen = view === "content-editor";
  const isSectionModalOpen = view === "section-editor";

  if (view === "content-list" || view === "content-editor") {
    return (
      <section className="space-y-6">
        <div className="admin-toolbar">
          <ActionButton onClick={openNewContent} tone="green">
            Incluir
          </ActionButton>
          <ActionButton>Buscar</ActionButton>
          <ActionButton tone="red">Excluir</ActionButton>
          <select className="admin-input ml-2 min-w-[145px]">
            <option>Publicado</option>
            <option>Novo</option>
            <option>Arquivado</option>
          </select>
          <ActionButton>Mudar Status</ActionButton>
          <ActionButton>Mudar Usuário</ActionButton>
          <ActionButton>Mudar Datas</ActionButton>
          <ActionButton tone="green">Marcar Newsletter</ActionButton>
          <ActionButton tone="red">Desmarcar Newsletter</ActionButton>
          <ActionButton>Mudar Ordem</ActionButton>
        </div>

        <div className="admin-table-panel overflow-x-auto">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th className="w-[40px]">
                  <input type="checkbox" />
                </th>
                <th className="w-[90px]">Id</th>
                <th className="w-[140px]">Data</th>
                <th>Conteúdo</th>
                <th>Seções Associadas</th>
                <th className="w-[95px]">Máscara</th>
                <th className="w-[80px]">News.</th>
                <th className="w-[240px]">Usuário</th>
                <th className="w-[90px]">Status</th>
                <th className="w-[150px]">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((content) => (
                <tr key={content.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{displayRecordCode(content.displayId, content.id)}</td>
                  <td>
                    <div>{formatDate(content.publishedAt)}</div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-[6px] border border-[#d7e3f1] bg-[#f8fbff] px-2 py-1 text-[13px] text-[#58708a]">
                      {formatTime(content.publishedAt)}
                    </div>
                  </td>
                  <td>
                    <button
                      className="text-left text-[#0c67ad] hover:underline"
                      onClick={() => selectContent(content)}
                      type="button"
                    >
                      {content.title}
                    </button>
                  </td>
                  <td className="text-[#0c67ad]">
                    {formatSectionBreadcrumb(content.section, sections)}
                  </td>
                  <td>{content.contentType.name}</td>
                  <td>--</td>
                  <td>{content.author?.name ?? "--"}</td>
                  <td className="text-[#0c67ad]">{formatContentStatus(content.status)}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button
                        className="text-left text-[#0c67ad] hover:underline"
                        onClick={() => selectContent(content)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="text-left text-[#c4473c] hover:underline"
                        onClick={() => removeEntity(`/contents/admin/${content.id}`, "Conteúdo excluído com sucesso.")}
                        type="button"
                      >
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
          isOpen={isContentModalOpen}
          onClose={() => setView("content-list")}
          size="full"
          title={contentForm.id ? "Editar Conteúdo" : "Novo Conteúdo"}
        >
          <form className="admin-modal-form grid gap-0 lg:grid-cols-[minmax(0,1fr)_180px]" onSubmit={handleContentSubmit}>
            <div className="space-y-0 pr-0 lg:pr-4">
              <div className="admin-form-row rounded-t-[8px] border-t">
                <label className="admin-label">Máscara: (?)</label>
                <select
                  className="admin-input"
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      contentTypeId: event.target.value
                    }))
                  }
                  value={contentForm.contentTypeId}
                >
                  {meta.contentTypes.map((contentType) => (
                    <option key={contentType.id} value={contentType.id}>
                      {contentType.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-0 border-x border-t border-[#d7e3f1] bg-[#f8fbff] px-6 py-5 lg:grid-cols-6">
                <div className="lg:col-span-2">
                  <label className="admin-label">Data do conteúdo: (?)</label>
                  <input
                    className="admin-input"
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        publishDate: event.target.value
                      }))
                    }
                    value={contentForm.publishDate}
                  />
                </div>
                <div className="lg:col-span-1 lg:px-3">
                  <label className="admin-label">Hora:</label>
                  <input
                    className="admin-input"
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        publishTime: event.target.value
                      }))
                    }
                    value={contentForm.publishTime}
                  />
                </div>
                <div className="lg:col-span-1 lg:px-3">
                  <label className="admin-label">Data inicial: (?)</label>
                  <input
                    className="admin-input"
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        startDate: event.target.value
                      }))
                    }
                    value={contentForm.startDate}
                  />
                </div>
                <div className="lg:col-span-1 lg:px-3">
                  <label className="admin-label">Data Final: (?)</label>
                  <input
                    className="admin-input"
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        endDate: event.target.value
                      }))
                    }
                    value={contentForm.endDate}
                  />
                </div>
                <div className="lg:col-span-1">
                  <label className="admin-label">Status: (?)</label>
                  <select
                    className="admin-input"
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        status: event.target.value as ContentFormState["status"]
                      }))
                    }
                    value={contentForm.status}
                  >
                    <option value="draft">Novo</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>

              <div className="admin-form-row">
                <label className="admin-label">Url amigável: (?)</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      slug: event.target.value
                    }))
                  }
                  value={contentForm.slug}
                />
              </div>

              <div className="admin-form-row">
                <label className="admin-label">Título do Conteúdo: (?)</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      title: event.target.value
                    }))
                  }
                  value={contentForm.title}
                />
              </div>

              <div className="admin-form-row">
                <label className="admin-label">Chamada destaque: (?)</label>
                <textarea
                  className="admin-textarea min-h-[84px]"
                  onChange={(event) =>
                    setContentForm((current) => ({
                      ...current,
                      excerpt: event.target.value
                    }))
                  }
                  value={contentForm.excerpt}
                />
              </div>

              <div className="overflow-hidden rounded-[8px] border border-[#d7e3f1] bg-white">
                <div className="bg-[#10233d] px-4 py-3 text-[14px] font-semibold text-white">
                  Conteúdo completo (selecione templates padrão a direita): (?)
                </div>
                <div className="border-t border-dashed border-[#d7e3f1] px-6 py-6">
                  <textarea
                    className="admin-textarea min-h-[180px]"
                    onChange={(event) =>
                      setContentForm((current) => ({
                        ...current,
                        body: event.target.value
                      }))
                    }
                    placeholder="+ Click para adicionar conteúdo"
                    value={contentForm.body}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <label className="admin-label">Entra na Newsletter?</label>
                <select className="admin-input">
                  <option>Não entra na Newsletter</option>
                  <option>Sim</option>
                </select>
              </div>

              <div className="admin-form-row">
                <label className="admin-label">Imagem de destaque do conteúdo (1300px x 730px): (?)</label>
                <div className="rounded-[8px] border border-[#d7e3f1] bg-white px-4 py-5 text-[15px] text-[#58708a]">Escolher arquivo</div>
              </div>

              <div className="mt-8">
                <h2 className="mb-5 text-[24px] font-semibold text-[#10233d]">Seções associadas</h2>
                <p className="admin-copy mb-4">
                  Associe abaixo as seções Origem e Destino nas quais deseja publicar o seu conteúdo.
                  Indique a seção principal marcando o rádio e a mesma seção visualizada marcando o checkbox.
                </p>
                <div className="admin-table-panel overflow-x-auto">
                  <table className="admin-table min-w-full">
                    <thead>
                      <tr>
                        <th className="w-[90px]">Origem</th>
                        <th className="w-[90px]">Destino</th>
                        <th>Seção</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sections.slice(0, 6).map((section) => (
                        <tr key={section.id}>
                          <td>
                            <input checked={contentForm.sectionId === section.id} name="origem" readOnly type="radio" />
                          </td>
                          <td>
                            <input type="checkbox" />
                          </td>
                          <td>{section.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-modal-footer flex items-center justify-between">
                <ActionButton>Salvar Imagens</ActionButton>
                <div className="flex gap-3">
                  <ActionButton onClick={() => setView("content-list")}>Cancelar</ActionButton>
                  <ActionButton tone="green" type="submit">
                    {contentForm.id ? "Salvar conteúdo" : "Incluir"}
                  </ActionButton>
                </div>
              </div>
            </div>

            <aside className="border-l border-[#d7e3f1] bg-[#f8fbff] px-4 py-3">
              <p className="mb-4 text-[22px] font-semibold text-[#10233d]">Básico</p>
              <div className="space-y-4">
                {templateLibrary.map((card) => (
                  <button
                    key={card.id}
                    className={`flex h-[62px] w-full items-center justify-center rounded-[8px] border border-[#d7e3f1] bg-gradient-to-r px-3 text-center text-[10px] font-semibold text-[#31516f] shadow-[0_8px_18px_rgba(15,33,57,0.06)] transition hover:-translate-y-0.5 hover:border-[#b9cde2] ${card.accent}`}
                    onClick={() =>
                      setContentForm((current) => ({
                        ...current,
                        body: `${current.body}\n\n[${card.title}]`
                      }))
                    }
                    type="button"
                  >
                    {card.title}
                  </button>
                ))}
              </div>
            </aside>
          </form>
        </AdminModal>
      </section>
    );
  }

  if (view === "sections-tree" || view === "section-editor") {
    return (
      <section className="space-y-8">
        <p className="admin-copy">
          Organização lógica e hierárquica para classificação dos conteúdos.
          Seções representam a arquitetura de informação que define a estrutura completa de navegação do Portal.
        </p>

        <div className="admin-toolbar">
          <ActionButton onClick={openNewSection} tone="green">
            Incluir Seção
          </ActionButton>
          <input className="admin-input min-w-[220px] flex-1" placeholder="Nome da seção para busca" />
          <ActionButton>Buscar</ActionButton>
        </div>

        <div className="admin-panel min-h-[380px] p-5">
          <div className="mb-3 text-[16px] font-semibold text-[#10233d]">≣ {portalRootLabel} ()</div>
          <div className="ml-6">
            <SectionTree
              nodes={sectionTree}
              onDelete={(section) => void removeEntity(`/sections/admin/${section.id}`, "Seção excluída com sucesso.")}
              onEdit={editSection}
              onOpenContents={() => setView("content-list")}
            />
          </div>
        </div>

        <AdminModal
          error={manager.error}
          isOpen={isSectionModalOpen}
          onClose={() => setView("sections-tree")}
          size="xl"
          title={sectionForm.name ? "Editar Seção" : "Nova Seção"}
        >
          <form className="admin-modal-form space-y-6" onSubmit={handleSectionSubmit}>
            <div className="rounded-[8px] border border-[#d7e3f1] bg-[#f8fbff] px-4 py-4 text-[17px] font-semibold text-[#10233d]">Dados da Seção ...</div>

            <div>
              <label className="admin-label">Nome da Seção:</label>
              <input
                className="admin-input"
                onChange={(event) =>
                  setSectionForm((current) => ({ ...current, name: event.target.value }))
                }
                value={sectionForm.name}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="admin-label">Template ou link associado a seção:</label>
                <select className="admin-input">
                  <option>Selecione</option>
                  {meta.templates.map((template) => (
                    <option key={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Templates disponíveis:</label>
                <select className="admin-input">
                  <option>Selecione</option>
                  {meta.templates.map((template) => (
                    <option key={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <ActionButton>Ver Template</ActionButton>
              </div>
              <div>
                <label className="admin-label">Novo Template ou link:</label>
                <input className="admin-input" />
              </div>
            </div>

            <div>
              <label className="admin-label">Url Amigável:</label>
              <input
                className="admin-input"
                onChange={(event) =>
                  setSectionForm((current) => ({ ...current, slug: event.target.value }))
                }
                value={sectionForm.slug}
              />
            </div>

            <div>
              <label className="admin-label">Posição da seção (paternidade dos menus):</label>
              <select
                className="admin-input"
                onChange={(event) =>
                  setSectionForm((current) => ({ ...current, parentId: event.target.value }))
                }
                value={sectionForm.parentId}
              >
                <option value="">:: Selecione a seção Pai ::</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="admin-label">Menu Interno:</label>
                <select
                  className="admin-input"
                  onChange={(event) =>
                    setSectionForm((current) => ({
                      ...current,
                      visibleInMenu: event.target.value === "Sim"
                    }))
                  }
                  value={sectionForm.visibleInMenu ? "Sim" : "Não"}
                >
                  <option>Não</option>
                  <option>Sim</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Abertura:</label>
                <select className="admin-input">
                  <option>Mesma janela</option>
                  <option>Nova janela</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Controle:</label>
                <select className="admin-input">
                  <option>Livre</option>
                  <option>Restrito</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Ordem:</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setSectionForm((current) => ({ ...current, order: event.target.value }))
                  }
                  value={sectionForm.order}
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Descrição:</label>
              <textarea
                className="admin-textarea min-h-[120px]"
                onChange={(event) =>
                  setSectionForm((current) => ({
                    ...current,
                    description: event.target.value
                  }))
                }
                value={sectionForm.description}
              />
            </div>

            <div className="admin-modal-footer flex items-center justify-end gap-3">
              <ActionButton onClick={() => setView("sections-tree")}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                Salvar Seção
              </ActionButton>
            </div>
          </form>
        </AdminModal>
      </section>
    );
  }

  return null;
}
