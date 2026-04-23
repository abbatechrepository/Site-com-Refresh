"use client";

import { LegacyButton } from "../LegacyButton";
import {
  emptyPermissionForm,
  emptyRoleForm,
  menuGroups
} from "../../_lib/constants";
import { displayRecordCode, getBreadcrumbLabel, getPermissionLabel, toggleItem } from "../../_lib/utils";
import type { TopMenuKey, ViewKey } from "../../_lib/types";
import type { RefreshManager } from "./moduleTypes";

export function AccessModules({ manager }: { manager: RefreshManager }) {
  const {
    view,
    handlePermissionSubmit,
    permissionForm,
    setPermissionForm,
    editPermission,
    management,
    roleForm,
    setRoleForm,
    handleRoleSubmit,
    editRole,
    availableContentTypes,
    sections,
    removeEntity
  } = manager;
    if (view === "permissions") {
      return (
        <section className="space-y-6">
          <p className="text-[16px] leading-8 text-[#4b4b4b]">
            Configurações de permissões para acesso, inclusão, alteração e exclusão de registros nos aplicativos do Sistema.
          </p>
          <form className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" onSubmit={handlePermissionSubmit}>
            {permissionForm.id ? (
              <div className="flex items-center justify-between border border-[#cfe3f3] bg-[#eef7fd] px-4 py-3 text-[14px] text-[#215d85]">
                <span>Editando uma permissão administrativa existente.</span>
                <button
                  className="font-semibold text-[#0c67ad] hover:underline"
                  onClick={() => setPermissionForm(emptyPermissionForm)}
                  type="button"
                >
                  Cancelar edição
                </button>
              </div>
            ) : null}
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="legacy-label">Aplicativo</label>
                <select
                  className="legacy-input"
                  onChange={(event) => setPermissionForm((current) => ({ ...current, appId: event.target.value }))}
                  value={permissionForm.appId}
                >
                  <option value="">Selecione</option>
                  {management.applications.map((application) => (
                    <option key={application.id} value={application.id}>
                      {application.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="legacy-label">Grupo</label>
                <select
                  className="legacy-input"
                  onChange={(event) => setPermissionForm((current) => ({ ...current, roleId: event.target.value }))}
                  value={permissionForm.roleId}
                >
                  <option value="">Selecione</option>
                  {management.roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2">
                <LegacyButton tone="green" type="submit">
                  {permissionForm.id ? "Salvar" : "Incluir"}
                </LegacyButton>
                <LegacyButton onClick={() => setPermissionForm(emptyPermissionForm)}>Novo</LegacyButton>
              </div>
            </div>
            <div>
              <label className="legacy-label">Acesso</label>
              <div className="grid gap-2 lg:grid-cols-4">
                <label className="flex items-center gap-2 text-[14px]">
                  <input
                    checked={permissionForm.canCreate}
                    onChange={(event) => setPermissionForm((current) => ({ ...current, canCreate: event.target.checked }))}
                    type="checkbox"
                  />
                  Inclusão
                </label>
                <label className="flex items-center gap-2 text-[14px]">
                  <input
                    checked={permissionForm.canUpdate}
                    onChange={(event) => setPermissionForm((current) => ({ ...current, canUpdate: event.target.checked }))}
                    type="checkbox"
                  />
                  Alteração
                </label>
                <label className="flex items-center gap-2 text-[14px]">
                  <input
                    checked={permissionForm.canDelete}
                    onChange={(event) => setPermissionForm((current) => ({ ...current, canDelete: event.target.checked }))}
                    type="checkbox"
                  />
                  Exclusão
                </label>
                <label className="flex items-center gap-2 text-[14px]">
                  <input
                    checked={permissionForm.canAccess}
                    onChange={(event) => setPermissionForm((current) => ({ ...current, canAccess: event.target.checked }))}
                    type="checkbox"
                  />
                  Acesso
                </label>
              </div>
            </div>
          </form>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="legacy-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[40px]">
                    <input type="checkbox" />
                  </th>
                  <th className="w-[90px]">Id</th>
                  <th>Aplicativo</th>
                  <th>Grupo</th>
                  <th>Inclui</th>
                  <th>Altera</th>
                  <th>Exclui</th>
                  <th>Acessa</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {management.roleApplicationAccesses.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{displayRecordCode(row.legacyId, row.id)}</td>
                    <td>
                      <button
                        className="text-[#0c67ad] hover:underline"
                        onClick={() => editPermission(row)}
                        type="button"
                      >
                        {row.appName}
                      </button>
                    </td>
                    <td className="text-[#0c67ad]">{row.roleName}</td>
                    <td>{row.canCreate ? "Sim" : "Não"}</td>
                    <td>{row.canUpdate ? "Sim" : "Não"}</td>
                    <td>{row.canDelete ? "Sim" : "Não"}</td>
                    <td>{row.canAccess ? "Sim" : "Não"}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <button
                          className="text-left text-[#0c67ad] hover:underline"
                          onClick={() => editPermission(row)}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          className="text-left text-[#c4473c] hover:underline"
                          onClick={() =>
                            removeEntity(
                              `/management/role-application-accesses/${row.id}`,
                              "Permissão excluída com sucesso."
                            )
                          }
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
        </section>
      );
    }

    if (view === "groups") {
      return (
        <section className="space-y-6">
          <p className="text-[16px] leading-8 text-[#4b4b4b]">
            O Workflow de publicação sempre inicia com o grupo de Autor e termina com o Publicador. Entre o Autor e o Publicador poderão ser acrescentados vários grupos de Editor conforme a necessidade.
          </p>
          <form className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" onSubmit={handleRoleSubmit}>
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="legacy-label">Nome do perfil</label>
                <input
                  className="legacy-input"
                  onChange={(event) => setRoleForm((current) => ({ ...current, name: event.target.value }))}
                  value={roleForm.name}
                />
              </div>
              <div>
                <label className="legacy-label">Descrição</label>
                <input
                  className="legacy-input"
                  onChange={(event) => setRoleForm((current) => ({ ...current, description: event.target.value }))}
                  value={roleForm.description}
                />
              </div>
              <div>
                <label className="legacy-label">Função</label>
                <input
                  className="legacy-input"
                  onChange={(event) => setRoleForm((current) => ({ ...current, functionName: event.target.value }))}
                  value={roleForm.functionName}
                />
              </div>
              <div>
                <label className="legacy-label">Status</label>
                <select
                  className="legacy-input"
                  onChange={(event) => setRoleForm((current) => ({ ...current, status: event.target.value }))}
                  value={roleForm.status}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Excluído">Excluído</option>
                </select>
              </div>
            </div>
            <div>
              <label className="legacy-label">Grupo superior</label>
              <select
                className="legacy-input"
                onChange={(event) => setRoleForm((current) => ({ ...current, parentRoleId: event.target.value }))}
                value={roleForm.parentRoleId}
              >
                <option value="">Selecione</option>
                {management.roles
                  .filter((role) => role.id !== roleForm.id)
                  .map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="legacy-label">Permissões do perfil</label>
              <div className="grid gap-2 lg:grid-cols-3">
                {management.permissions.map((permission) => (
                  <label className="flex items-center gap-2 text-[14px]" key={permission.id}>
                    <input
                      checked={roleForm.permissionIds.includes(permission.id)}
                      onChange={() =>
                        setRoleForm((current) => ({
                          ...current,
                          permissionIds: toggleItem(current.permissionIds, permission.id)
                        }))
                      }
                      type="checkbox"
                    />
                    {getPermissionLabel(permission.code)}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="legacy-label">Seções associadas</label>
                <div className="max-h-[220px] overflow-auto border border-[#e4e4e4] bg-white p-3">
                  <div className="grid gap-2">
                    {sections.map((section) => (
                      <label className="flex items-center gap-2 text-[14px]" key={section.id}>
                        <input
                          checked={roleForm.sectionIds.includes(section.id)}
                          onChange={() =>
                            setRoleForm((current) => ({
                              ...current,
                              sectionIds: toggleItem(current.sectionIds, section.id)
                            }))
                          }
                          type="checkbox"
                        />
                        {section.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="legacy-label">Máscaras permitidas</label>
                <p className="mb-2 text-[12px] text-[#666]">
                  Estas máscaras definem quais tipos de conteúdo este grupo pode listar, criar e editar.
                </p>
                <div className="max-h-[220px] overflow-auto border border-[#e4e4e4] bg-white p-3">
                  <div className="grid gap-2">
                    {availableContentTypes.map((contentType) => (
                      <label className="flex items-center gap-2 text-[14px]" key={contentType.id}>
                        <input
                          checked={roleForm.contentTypeIds.includes(contentType.id)}
                          onChange={() =>
                            setRoleForm((current) => ({
                              ...current,
                              contentTypeIds: toggleItem(current.contentTypeIds, contentType.id)
                            }))
                          }
                          type="checkbox"
                        />
                        {contentType.name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="legacy-label">Menus habilitados para este grupo</label>
              <div className="grid gap-4 lg:grid-cols-2">
                {(Object.entries(menuGroups) as Array<[TopMenuKey, Array<{ key: ViewKey; label: string }>]>).map(([menuKey, items]) => (
                  <div className="border border-[#e4e4e4] bg-white p-3" key={menuKey}>
                    <div className="mb-3 text-[14px] font-semibold text-[#333]">
                      {menuKey === "administration" ? "Administração" : menuKey === "newsletter" ? "Newsletter" : menuKey === "system" ? "Sistema" : "Conteúdo"}
                    </div>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <label className="flex items-center gap-2 text-[14px]" key={item.key}>
                          <input
                            checked={roleForm.menuAccessKeys.includes(`${menuKey}:${item.key}`)}
                            onChange={() =>
                              setRoleForm((current) => ({
                                ...current,
                                menuAccessKeys: toggleItem(current.menuAccessKeys, `${menuKey}:${item.key}`)
                              }))
                            }
                            type="checkbox"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <LegacyButton tone="green" type="submit">
                {roleForm.id ? "Salvar" : "Incluir"}
              </LegacyButton>
              <LegacyButton onClick={() => setRoleForm(emptyRoleForm)}>Novo</LegacyButton>
            </div>
          </form>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="legacy-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[40px]">
                    <input type="checkbox" />
                  </th>
                  <th className="w-[90px]">Id</th>
                  <th>Nome do Grupo</th>
                  <th>Workflow</th>
                  <th>Descrição</th>
                  <th>Status</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {management.roles.map((role) => (
                  <tr key={role.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{displayRecordCode(role.legacyId, role.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => editRole(role)} type="button">
                        {role.name}
                      </button>
                    </td>
                    <td className="text-[#0c67ad]">
                      {role.functionName ?? "-"}
                      {role.parentRoleName ? <div className="text-[12px] text-[#666]">Superior: {role.parentRoleName}</div> : null}
                    </td>
                    <td className="text-[#0c67ad]">
                      {role.description}
                      <div className="mt-2 text-[12px] text-[#666]">
                        Menus: {role.menuAccesses.map((access) => getBreadcrumbLabel(access.viewKey)).join(", ") || "Nenhum"}
                      </div>
                      <div className="mt-1 text-[12px] text-[#666]">
                        Máscaras: {role.contentTypeIds.length} | Seções: {role.sectionIds.length}
                      </div>
                    </td>
                    <td className="text-[#0c67ad]">{role.status ?? "Ativo"}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <button className="text-left text-[#0c67ad] hover:underline" onClick={() => editRole(role)} type="button">
                          Editar
                        </button>
                        <button className="text-left text-[#c4473c] hover:underline" onClick={() => removeEntity(`/management/roles/${role.id}`, "Grupo excluído com sucesso.")} type="button">
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

}
