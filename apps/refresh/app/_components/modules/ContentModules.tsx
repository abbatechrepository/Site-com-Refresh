"use client";

import { LegacyButton } from "../LegacyButton";
import { SectionTree } from "../SectionTree";
import { templateLibrary } from "../../_lib/constants";
import { displayRecordCode, formatDate, formatTime, legacyStatus } from "../../_lib/utils";
import type { ContentFormState } from "../../_lib/types";
import type { RefreshManager } from "./moduleTypes";

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
  if (view === "content-list") {
    return (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <LegacyButton onClick={openNewContent} tone="green">
              Incluir
            </LegacyButton>
            <LegacyButton>Buscar</LegacyButton>
            <LegacyButton tone="red">Excluir</LegacyButton>
            <select className="ml-4 h-[38px] min-w-[135px] border border-[#d7d7d7] bg-white px-3 text-[15px]">
              <option>Publicado</option>
              <option>Novo</option>
              <option>Arquivado</option>
            </select>
            <LegacyButton>Mudar Status</LegacyButton>
            <LegacyButton>Mudar Usuário</LegacyButton>
            <LegacyButton>Mudar Datas</LegacyButton>
            <LegacyButton tone="green">Marcar Newsletter</LegacyButton>
            <LegacyButton tone="red">Desmarcar Newsletter</LegacyButton>
            <LegacyButton>Mudar Ordem</LegacyButton>
          </div>

          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="legacy-table min-w-full">
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
                    <td>{displayRecordCode(content.legacyId, content.id)}</td>
                    <td>
                      <div>{formatDate(content.publishedAt)}</div>
                      <div className="mt-2 inline-flex items-center gap-2 border border-[#ddd] px-2 py-1 text-[13px]">
                        {formatTime(content.publishedAt)}
                      </div>
                    </td>
                    <td>
                      <button className="text-left text-[#0c67ad] hover:underline" onClick={() => selectContent(content)} type="button">
                        {content.title}
                      </button>
                    </td>
                    <td className="text-[#0c67ad]">
                      &gt;conectahc&gt;Home&gt;{content.section.name}
                    </td>
                    <td>{content.contentType.name}</td>
                    <td>--</td>
                    <td>{content.author?.name ?? "--"}</td>
                    <td className="text-[#0c67ad]">{legacyStatus(content.status)}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <button className="text-left text-[#0c67ad] hover:underline" onClick={() => selectContent(content)} type="button">
                          Editar
                        </button>
                        <button className="text-left text-[#c4473c] hover:underline" onClick={() => removeEntity(`/contents/admin/${content.id}`, "Conteúdo excluído com sucesso.")} type="button">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    }

    if (view === "content-editor") {
      return (
        <form className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_180px]" onSubmit={handleContentSubmit}>
          <div className="space-y-0 pr-0 lg:pr-4">
            <div className="legacy-form-row">
              <label className="legacy-label">Máscara: (?)</label>
              <select
                className="legacy-input"
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

            <div className="grid grid-cols-1 gap-0 border-x border-t border-[#e5e5e5] bg-[#f4f4f4] px-6 py-5 lg:grid-cols-6">
              <div className="lg:col-span-2">
                <label className="legacy-label">Data do conteúdo: (?)</label>
                <input
                  className="legacy-input"
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
                <label className="legacy-label">Hora:</label>
                <input
                  className="legacy-input"
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
                <label className="legacy-label">Data inicial: (?)</label>
                <input
                  className="legacy-input"
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
                <label className="legacy-label">Data Final: (?)</label>
                <input
                  className="legacy-input"
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
                <label className="legacy-label">Status: (?)</label>
                <select
                  className="legacy-input"
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

            <div className="legacy-form-row">
              <label className="legacy-label">Url amigável: (?)</label>
              <input
                className="legacy-input"
                onChange={(event) =>
                  setContentForm((current) => ({
                    ...current,
                    slug: event.target.value
                  }))
                }
                value={contentForm.slug}
              />
            </div>

            <div className="legacy-form-row">
              <label className="legacy-label">Título do Conteúdo: (?)</label>
              <input
                className="legacy-input"
                onChange={(event) =>
                  setContentForm((current) => ({
                    ...current,
                    title: event.target.value
                  }))
                }
                value={contentForm.title}
              />
            </div>

            <div className="legacy-form-row">
              <label className="legacy-label">Chamada destaque: (?)</label>
              <textarea
                className="legacy-textarea min-h-[84px]"
                onChange={(event) =>
                  setContentForm((current) => ({
                    ...current,
                    excerpt: event.target.value
                  }))
                }
                value={contentForm.excerpt}
              />
            </div>

            <div className="border border-[#c9c9c9]">
              <div className="bg-[#4f4f4f] px-3 py-3 text-[15px] font-semibold text-white">
                Conteúdo completo (selecione templates padrão a direita): (?)
              </div>
              <div className="border-t border-dashed border-[#d9d9d9] px-6 py-6">
                <textarea
                  className="min-h-[180px] w-full border border-[#ddd] px-4 py-4 text-[15px] outline-none"
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

            <div className="legacy-form-row">
              <label className="legacy-label">Entra na Newsletter?</label>
              <select className="legacy-input">
                <option>Não entra na Newsletter</option>
                <option>Sim</option>
              </select>
            </div>

            <div className="legacy-form-row">
              <label className="legacy-label">Imagem de destaque do conteúdo (1300px x 730px): (?)</label>
              <div className="border border-[#ddd] bg-white px-4 py-5 text-[15px] text-[#666]">Escolher arquivo</div>
            </div>

            <div className="mt-8">
              <h2 className="mb-6 text-[28px] font-light text-[#151515]">Seções associadas</h2>
              <p className="mb-4 text-[15px] leading-7 text-[#444]">
                Associe abaixo as seções Origem e Destino nas quais deseja publicar o seu conteúdo.
                Indique a seção principal marcando o rádio e a mesma seção visualizada marcando o checkbox.
              </p>
              <div className="overflow-x-auto border border-[#d8d8d8]">
                <table className="legacy-table min-w-full">
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

            <div className="mt-6 flex items-center justify-between">
              <LegacyButton>Salvar Imagens</LegacyButton>
              <div className="flex gap-3">
                <LegacyButton onClick={() => setView("content-list")}>Voltar</LegacyButton>
                <LegacyButton tone="green" type="submit">
                  Incluir
                </LegacyButton>
              </div>
            </div>
          </div>

          <aside className="border-l border-[#ececec] bg-[#fbfbfb] px-4 py-2">
            <p className="mb-4 text-[30px] font-light text-[#444]">Básico</p>
            <div className="space-y-4">
              {templateLibrary.map((card) => (
                <button
                  key={card.id}
                  className={`flex h-[62px] w-full items-center justify-center border border-[#e2e2e2] bg-gradient-to-r px-3 text-center text-[10px] font-semibold text-[#555] ${card.accent}`}
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
      );
    }

    if (view === "sections-tree") {
      return (
        <section className="space-y-8">
          <p className="max-w-[980px] text-[16px] leading-8 text-[#4b4b4b]">
            Organização lógica e hierárquica para classificação dos conteúdos.
            Seções representam a arquitetura de informação que define a estrutura completa de navegação do Portal.
          </p>

          <div className="flex items-center gap-4 border border-[#e6e6e6] px-4 py-3">
            <LegacyButton onClick={openNewSection} tone="green">
              Incluir Seção
            </LegacyButton>
            <input className="h-[38px] flex-1 border border-[#ddd] px-3 text-[15px] outline-none" placeholder="Nome da seção para busca" />
            <LegacyButton>Buscar</LegacyButton>
          </div>

          <div className="min-h-[380px]">
            <div className="mb-2 text-[17px] font-semibold text-[#333]">≣ conectahc ()</div>
            <div className="ml-6">
              <SectionTree
                nodes={sectionTree}
                onDelete={(section) => void removeEntity(`/sections/admin/${section.id}`, "Seção excluída com sucesso.")}
                onEdit={editSection}
                onOpenContents={() => setView("content-list")}
              />
            </div>
          </div>
        </section>
      );
    }

    if (view === "section-editor") {
      return (
        <section className="space-y-8">
          <p className="max-w-[980px] text-[16px] leading-8 text-[#4b4b4b]">
            Organização lógica e hierárquica para classificação dos conteúdos.
            Seções representam a arquitetura de informação que define a estrutura completa de navegação do Portal.
          </p>

          <form className="border border-[#dedede]" onSubmit={handleSectionSubmit}>
            <div className="border-b border-[#ececec] bg-[#f7f7f7] px-4 py-4 text-[18px] text-[#333]">Dados da Seção ...</div>

            <div className="space-y-6 px-4 py-5">
              <div>
                <label className="legacy-label">Nome da Seção:</label>
                <input
                  className="legacy-input"
                  onChange={(event) =>
                    setSectionForm((current) => ({ ...current, name: event.target.value }))
                  }
                  value={sectionForm.name}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                <div>
                  <label className="legacy-label">Template ou link associado a seção:</label>
                  <select className="legacy-input">
                    <option>Selecione</option>
                    {meta.templates.map((template) => (
                      <option key={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="legacy-label">Templates disponíveis:</label>
                  <select className="legacy-input">
                    <option>Selecione</option>
                    {meta.templates.map((template) => (
                      <option key={template.id}>{template.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <LegacyButton>Ver Template</LegacyButton>
                </div>
                <div>
                  <label className="legacy-label">Novo Template ou link:</label>
                  <input className="legacy-input" />
                </div>
              </div>

              <div>
                <label className="legacy-label">Url Amigável:</label>
                <input
                  className="legacy-input"
                  onChange={(event) =>
                    setSectionForm((current) => ({ ...current, slug: event.target.value }))
                  }
                  value={sectionForm.slug}
                />
              </div>

              <div>
                <label className="legacy-label">Posição da seção (paternidade dos menus):</label>
                <select
                  className="legacy-input"
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
                  <label className="legacy-label">Menu Interno:</label>
                  <select
                    className="legacy-input"
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
                  <label className="legacy-label">Abertura:</label>
                  <select className="legacy-input">
                    <option>Mesma janela</option>
                    <option>Nova janela</option>
                  </select>
                </div>
                <div>
                  <label className="legacy-label">Controle:</label>
                  <select className="legacy-input">
                    <option>Livre</option>
                    <option>Restrito</option>
                  </select>
                </div>
                <div>
                  <label className="legacy-label">Ordem:</label>
                  <input
                    className="legacy-input"
                    onChange={(event) =>
                      setSectionForm((current) => ({ ...current, order: event.target.value }))
                    }
                    value={sectionForm.order}
                  />
                </div>
              </div>

              <div>
                <label className="legacy-label">Descrição:</label>
                <textarea
                  className="legacy-textarea min-h-[120px]"
                  onChange={(event) =>
                    setSectionForm((current) => ({
                      ...current,
                      description: event.target.value
                    }))
                  }
                  value={sectionForm.description}
                />
              </div>

              <div className="flex items-center justify-between">
                <LegacyButton onClick={() => setView("sections-tree")}>Voltar</LegacyButton>
                <LegacyButton tone="green" type="submit">
                  Salvar Seção
                </LegacyButton>
              </div>
            </div>
          </form>
        </section>
      );
    }

}
