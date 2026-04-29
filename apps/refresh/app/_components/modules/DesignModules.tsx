"use client";

import { useState } from "react";

import { ActionButton } from "../ActionButton";
import { AdminModal } from "../AdminModal";
import {
  emptyContentTypeForm,
  emptyElementForm,
  emptyTemplateForm
} from "../../_lib/constants";
import { displayRecordCode } from "../../_lib/utils";
import type { RefreshManager } from "./moduleTypes";

type DesignModal = "content-type" | "template" | "element";

export function DesignModules({ manager }: { manager: RefreshManager }) {
  const {
    view,
    handleContentTypeSubmit,
    contentTypeForm,
    setContentTypeForm,
    availableContentTypes,
    editContentType,
    management,
    handleTemplateSubmit,
    templateForm,
    setTemplateForm,
    editTemplate,
    handleElementSubmit,
    elementForm,
    setElementForm,
    editElement,
    removeEntity
  } = manager;
  const [activeModal, setActiveModal] = useState<DesignModal | null>(null);

  function closeModal() {
    if (activeModal === "content-type") {
      setContentTypeForm(emptyContentTypeForm);
    }

    if (activeModal === "template") {
      setTemplateForm(emptyTemplateForm);
    }

    if (activeModal === "element") {
      setElementForm(emptyElementForm);
    }

    setActiveModal(null);
  }

  function openNewContentType() {
    setContentTypeForm(emptyContentTypeForm);
    setActiveModal("content-type");
  }

  function openEditContentType(contentType: (typeof availableContentTypes)[number]) {
    editContentType(contentType);
    setActiveModal("content-type");
  }

  function openNewTemplate() {
    setTemplateForm(emptyTemplateForm);
    setActiveModal("template");
  }

  function openEditTemplate(template: (typeof management.templates)[number]) {
    editTemplate(template);
    setActiveModal("template");
  }

  function openNewElement() {
    setElementForm(emptyElementForm);
    setActiveModal("element");
  }

  function openEditElement(element: (typeof management.elements)[number]) {
    editElement(element);
    setActiveModal("element");
  }

  if (view === "masks") {
    return (
      <section className="space-y-6">
        <p className="text-[16px] leading-8 text-[#4b4b4b]">
          Determina para o usuário a formatação da inclusão para cada tipo de conteúdo.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton onClick={openNewContentType} tone="green">
            Incluir Máscara
          </ActionButton>
        </div>

        <div className="overflow-x-auto border border-[#d8d8d8]">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th className="w-[40px]">
                  <input type="checkbox" />
                </th>
                <th className="w-[90px]">Id</th>
                <th>Nome da Máscara</th>
                <th className="w-[90px]">Ação</th>
              </tr>
            </thead>
            <tbody>
              {availableContentTypes.map((contentType) => (
                <tr key={contentType.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{displayRecordCode(contentType.displayId, contentType.id)}</td>
                  <td>
                    <button
                      className="text-[#0c67ad] hover:underline"
                      onClick={() => openEditContentType(contentType)}
                      type="button"
                    >
                      {contentType.name}
                    </button>
                  </td>
                  <td>
                    <button
                      className="text-[#0c67ad] hover:underline"
                      onClick={() => openEditContentType(contentType)}
                      type="button"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdminModal
          error={manager.error}
          isOpen={activeModal === "content-type"}
          onClose={closeModal}
          size="lg"
          title={contentTypeForm.id ? "Editar Máscara" : "Nova Máscara"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleContentTypeSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="admin-label">Nome da máscara</label>
                <input
                  className="admin-input"
                  onChange={(event) => setContentTypeForm((current) => ({ ...current, name: event.target.value }))}
                  value={contentTypeForm.name}
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input
                  className="admin-input"
                  onChange={(event) => setContentTypeForm((current) => ({ ...current, slug: event.target.value }))}
                  value={contentTypeForm.slug}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Descrição</label>
              <input
                className="admin-input"
                onChange={(event) =>
                  setContentTypeForm((current) => ({ ...current, description: event.target.value }))
                }
                value={contentTypeForm.description}
              />
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  checked={contentTypeForm.allowRichText}
                  onChange={(event) =>
                    setContentTypeForm((current) => ({ ...current, allowRichText: event.target.checked }))
                  }
                  type="checkbox"
                />
                Editor rico
              </label>
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  checked={contentTypeForm.allowFeaturedMedia}
                  onChange={(event) =>
                    setContentTypeForm((current) => ({ ...current, allowFeaturedMedia: event.target.checked }))
                  }
                  type="checkbox"
                />
                Mídia destacada
              </label>
            </div>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {contentTypeForm.id ? "Salvar" : "Incluir"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>
      </section>
    );
  }

  if (view === "templates") {
    return (
      <section className="space-y-6">
        <p className="max-w-[1200px] text-[16px] leading-8 text-[#4b4b4b]">
          Os templates determinam a formatação de apresentação dos conteúdos que serão exibidos para o usuário de acordo com as configurações e regras programadas.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton onClick={openNewTemplate} tone="green">
            Incluir Template
          </ActionButton>
        </div>

        <div className="overflow-x-auto border border-[#d8d8d8]">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th className="w-[40px]">
                  <input type="checkbox" />
                </th>
                <th className="w-[90px]">Id</th>
                <th>Nome do Template</th>
                <th className="w-[140px]">Tipo</th>
                <th>Seções associadas</th>
                <th>Observações</th>
                <th className="w-[90px]">Ação</th>
              </tr>
            </thead>
            <tbody>
              {management.templates.map((template) => (
                <tr key={template.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{displayRecordCode(template.displayId, template.id)}</td>
                  <td>
                    <button
                      className="text-[#0c67ad] hover:underline"
                      onClick={() => openEditTemplate(template)}
                      type="button"
                    >
                      {template.slug}
                    </button>
                  </td>
                  <td>{template.componentKey ?? "Template"}</td>
                  <td>--</td>
                  <td>{template.description ?? ""}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button
                        className="text-left text-[#0c67ad] hover:underline"
                        onClick={() => openEditTemplate(template)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="text-left text-[#c4473c] hover:underline"
                        onClick={() => removeEntity(`/management/templates/${template.id}`, "Template excluído com sucesso.")}
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
          isOpen={activeModal === "template"}
          onClose={closeModal}
          size="lg"
          title={templateForm.id ? "Editar Template" : "Novo Template"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleTemplateSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="admin-label">Nome do template</label>
                <input
                  className="admin-input"
                  onChange={(event) => setTemplateForm((current) => ({ ...current, name: event.target.value }))}
                  value={templateForm.name}
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input
                  className="admin-input"
                  onChange={(event) => setTemplateForm((current) => ({ ...current, slug: event.target.value }))}
                  value={templateForm.slug}
                />
              </div>
              <div>
                <label className="admin-label">Componente</label>
                <input
                  className="admin-input"
                  onChange={(event) => setTemplateForm((current) => ({ ...current, componentKey: event.target.value }))}
                  value={templateForm.componentKey}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Descrição</label>
              <input
                className="admin-input"
                onChange={(event) => setTemplateForm((current) => ({ ...current, description: event.target.value }))}
                value={templateForm.description}
              />
            </div>
            <label className="flex items-center gap-2 text-[14px]">
              <input
                checked={templateForm.isActive}
                onChange={(event) => setTemplateForm((current) => ({ ...current, isActive: event.target.checked }))}
                type="checkbox"
              />
              Template ativo
            </label>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {templateForm.id ? "Salvar" : "Incluir"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>
      </section>
    );
  }

  if (view === "elements") {
    return (
      <section className="space-y-6">
        <p className="text-[16px] leading-8 text-[#4b4b4b]">
          Elementos Tipo HTML para utilização no cadastro de conteúdos.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <ActionButton onClick={openNewElement} tone="green">
            Incluir Bloco
          </ActionButton>
        </div>

        <div className="overflow-x-auto border border-[#d8d8d8]">
          <table className="admin-table min-w-full">
            <thead>
              <tr>
                <th className="w-[40px]">
                  <input type="checkbox" />
                </th>
                <th className="w-[90px]">Id</th>
                <th>Nome Elemento</th>
                <th>Thumb Elemento</th>
                <th>Categoria</th>
                <th>Status</th>
                <th className="w-[90px]">Ação</th>
              </tr>
            </thead>
            <tbody>
              {management.elements.map((element) => (
                <tr key={element.id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{displayRecordCode(element.displayId, element.id)}</td>
                  <td>
                    <button
                      className="text-[#0c67ad] hover:underline"
                      onClick={() => openEditElement(element)}
                      type="button"
                    >
                      {element.name}
                    </button>
                  </td>
                  <td>
                    <div className="inline-flex h-[68px] w-[265px] items-center justify-center bg-gradient-to-r from-[#f3f3f3] to-[#fcfcfc] text-[18px] font-semibold text-[#555]">
                      {element.thumbLabel ?? "Sem thumb"}
                    </div>
                  </td>
                  <td className="text-[#0c67ad]">{element.category ?? "--"}</td>
                  <td className="text-[#0c67ad]">{element.status === "active" ? "Ativo" : "Inativo"}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <button
                        className="text-left text-[#0c67ad] hover:underline"
                        onClick={() => openEditElement(element)}
                        type="button"
                      >
                        Editar
                      </button>
                      <button
                        className="text-left text-[#c4473c] hover:underline"
                        onClick={() => removeEntity(`/management/elements/${element.id}`, "Elemento excluído com sucesso.")}
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
          isOpen={activeModal === "element"}
          onClose={closeModal}
          size="xl"
          title={elementForm.id ? "Editar Bloco" : "Novo Bloco"}
        >
          <form
            className="admin-modal-form space-y-4"
            onSubmit={async (event) => {
              const saved = await handleElementSubmit(event);

              if (saved) {
                setActiveModal(null);
              }
            }}
          >
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="admin-label">Nome</label>
                <input
                  className="admin-input"
                  onChange={(event) => setElementForm((current) => ({ ...current, name: event.target.value }))}
                  value={elementForm.name}
                />
              </div>
              <div>
                <label className="admin-label">Thumb</label>
                <input
                  className="admin-input"
                  onChange={(event) => setElementForm((current) => ({ ...current, thumbLabel: event.target.value }))}
                  value={elementForm.thumbLabel}
                />
              </div>
              <div>
                <label className="admin-label">Categoria</label>
                <input
                  className="admin-input"
                  onChange={(event) => setElementForm((current) => ({ ...current, category: event.target.value }))}
                  value={elementForm.category}
                />
              </div>
              <div>
                <label className="admin-label">Status</label>
                <select
                  className="admin-input"
                  onChange={(event) => setElementForm((current) => ({ ...current, status: event.target.value }))}
                  value={elementForm.status}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
            </div>
            <div>
              <label className="admin-label">HTML / conteúdo do bloco</label>
              <textarea
                className="admin-textarea min-h-[180px]"
                onChange={(event) => setElementForm((current) => ({ ...current, content: event.target.value }))}
                value={elementForm.content}
              />
            </div>
            <div className="admin-modal-footer flex flex-wrap justify-end gap-2">
              <ActionButton onClick={closeModal}>Cancelar</ActionButton>
              <ActionButton tone="green" type="submit">
                {elementForm.id ? "Salvar" : "Incluir"}
              </ActionButton>
            </div>
          </form>
        </AdminModal>
      </section>
    );
  }

  return null;
}
