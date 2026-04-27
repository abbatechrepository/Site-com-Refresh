"use client";

import { ActionButton } from "../ActionButton";
import { emptyUserForm } from "../../_lib/constants";
import { displayRecordCode, toggleItem } from "../../_lib/utils";
import type { RefreshManager } from "./moduleTypes";
import { useState, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";

export function UserModules({ manager }: { manager: RefreshManager }) {
  const {
    view,
    handleUserSubmit,
    userForm,
    setUserForm,
    highlightedUserId,
    setHighlightedUserId,
    selectedUserPermissionLabels,
    selectedUserAppAccesses,
    sortedUsers,
    selectedUserIds,
    setSelectedUserIds,
    editUser,
    management,
    setTopMenu,
    setView,
    removeUsers
  } = manager;

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [profileTempImage, setProfileTempImage] = useState<File | null>(null);
  const [profileTempPreview, setProfileTempPreview] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [viewImageUrl, setViewImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (profileTempPreview) {
        URL.revokeObjectURL(profileTempPreview);
      }
    };
  }, [profileTempPreview]);

  const allVisibleUserIds = sortedUsers.map((managedUser) => managedUser.id);
  const allVisibleUsersSelected =
    allVisibleUserIds.length > 0 && allVisibleUserIds.every((userId) => selectedUserIds.includes(userId));

  function resetCrop() {
    if (profileTempPreview) {
      URL.revokeObjectURL(profileTempPreview);
    }

    setProfileTempImage(null);
    setProfileTempPreview("");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleCrop() {
    const image = new Image();
    const src = profileTempPreview
      ? profileTempPreview
      : userForm.picture
      ? `/abbatech/refresh${userForm.picture}`
      : null;

    if (!src) return;

    image.src = src;

    await new Promise((resolve) => {
      if (image.complete) resolve(true);
      else image.onload = resolve;
    });

    const canvas = document.createElement("canvas");

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    if (!croppedAreaPixels) return;

    const size = Math.min(
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    canvas.width = size;
    canvas.height = size;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      size,
      size,
      0,
      0,
      size,
      size
    );

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    if (!blob) return;

    if (profileTempPreview) {
      URL.revokeObjectURL(profileTempPreview);
    }

    const newUrl = URL.createObjectURL(blob);

    setProfileTempPreview(newUrl);
    setProfileTempImage(new File([blob], "cropped.jpg", { type: "image/jpeg" }));

    setIsPreviewOpen(false);
  }

  function toggleAllVisibleUsers() {
    setSelectedUserIds((current) => {
      if (allVisibleUsersSelected) {
        return current.filter((userId) => !allVisibleUserIds.includes(userId));
      }

      return Array.from(new Set([...current, ...allVisibleUserIds]));
    });
  }

  function confirmRemoveUsers(userIds: string[]) {
    if (userIds.length === 0) {
      void removeUsers([]);
      return;
    }

    if (window.confirm("Você tem certeza que deseja excluir este registro?")) {
      void removeUsers(userIds);
    }
  }

  function getUserRowClassName(managedUser: (typeof sortedUsers)[number]) {
    if (managedUser.id === highlightedUserId) {
      return "bg-[#fff8d9]";
    }

    if (managedUser.status === "Inativo") {
      return "bg-[#fee2d8]/55";
    }

    if (managedUser.status === "Novo") {
      return "bg-[#eeffdd]/70";
    }

    return undefined;
  }

    if (view === "users") {
      return (
        <section className="space-y-6">
          <form 
            className="space-y-4 border border-[#d8d8d8] bg-[#fbfbfb] p-4" 
            onSubmit={
              async (e) => {
                e.preventDefault();

                if (!userForm.picture && !profileTempImage) {
                  alert("Selecione uma imagem");
                  return;
                }

                if (profileTempPreview && !profileTempImage) {
                  alert("Corte a imagem antes de salvar");
                  return;
                }

                await handleUserSubmit(e, profileTempImage);

                resetCrop();
              }
            }
            encType="multipart/form-data">
            {userForm.id ? (
              <div className="flex items-center justify-between border border-[#cfe3f3] bg-[#eef7fd] px-4 py-3 text-[14px] text-[#215d85]">
                <span>Modo de edição ativo para este usuário.</span>
                <button
                  className="font-semibold text-[#0c67ad] hover:underline"
                  onClick={() => {
                    setUserForm(emptyUserForm);
                    setHighlightedUserId("");
                    resetCrop();
                  }}
                  type="button"
                >
                  Cancelar edição
                </button>
              </div>
            ) : null}
            <div>
              <label className="admin-label">Foto de Perfil</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  if (profileTempPreview) {
                    URL.revokeObjectURL(profileTempPreview);
                  }

                  const preview = URL.createObjectURL(file);

                  setProfileTempImage(file);
                  setProfileTempPreview(preview);

                  setIsPreviewOpen(true);
                }}
              />
            </div>
            {(profileTempPreview || userForm.picture) && (
              <div
                className="mt-2 w-24 h-24 overflow-hidden rounded cursor-zoom-in"
                onClick={() => {
                  if (profileTempPreview || userForm.picture) {
                    setIsPreviewOpen(true);
                  }
                }}
              >
                <img
                  src={
                    profileTempPreview
                      ? profileTempPreview
                      : userForm.picture
                        ? `/abbatech/refresh${userForm.picture}`
                        : ""
                  }
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="admin-label">Nome</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  value={userForm.name}
                />
              </div>
              <div>
                <label className="admin-label">E-mail</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  type="email"
                  value={userForm.email}
                />
              </div>
              <div>
                <label className="admin-label">Username</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, username: event.target.value }))}
                  required
                  value={userForm.username}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="admin-label">CPF</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, cpf: event.target.value }))}
                  value={userForm.cpf}
                />
              </div>
              <div>
                <label className="admin-label">CNH</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, cnh: event.target.value }))}
                  value={userForm.cnh}
                />
              </div>
              <div>
                <label className="admin-label">Senha temporária</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))}
                  minLength={6}
                  required={!userForm.id}
                  type="password"
                  value={userForm.password}
                />
              </div>
              <div>
                <label className="admin-label">Confirmação</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setUserForm((current) => ({ ...current, passwordConfirmation: event.target.value }))
                  }
                  minLength={6}
                  required={!userForm.id}
                  type="password"
                  value={userForm.passwordConfirmation}
                />
              </div>
              <div>
                <label className="admin-label">Status</label>
                <select
                  className="admin-input"
                  onChange={(event) =>
                    setUserForm((current) => ({
                      ...current,
                      status: event.target.value,
                      isActive: !["Inativo", "Excluído"].includes(event.target.value)
                    }))
                  }
                  value={userForm.status}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Verificado">Verificado</option>
                  <option value="Novo">Novo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Excluído">Excluído</option>
                </select>
              </div>
              <div className="flex items-end gap-2">
                <ActionButton tone="green" type="submit">
                  {userForm.id ? "Salvar alterações" : "Incluir"}
                </ActionButton>
                <ActionButton
                  onClick={() => {
                    setUserForm(emptyUserForm);
                    setHighlightedUserId("");
                    resetCrop();
                  }}
                >
                  Novo
                </ActionButton>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="admin-label">Empresa</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, company: event.target.value }))}
                  value={userForm.company}
                />
              </div>
              <div>
                <label className="admin-label">Função</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, jobTitle: event.target.value }))}
                  value={userForm.jobTitle}
                />
              </div>
              <div>
                <label className="admin-label">Telefone</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, phone: event.target.value }))}
                  value={userForm.phone}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-3">
                <label className="admin-label">Endereço</label>
                <textarea
                  className="admin-textarea"
                  onChange={(event) => setUserForm((current) => ({ ...current, address: event.target.value }))}
                  value={userForm.address}
                />
              </div>
              <div>
                <label className="admin-label">CEP</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, zipCode: event.target.value }))}
                  value={userForm.zipCode}
                />
              </div>
              <div>
                <label className="admin-label">Cidade</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, city: event.target.value }))}
                  value={userForm.city}
                />
              </div>
              <div>
                <label className="admin-label">Estado</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, state: event.target.value }))}
                  value={userForm.state}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              <div>
                <label className="admin-label">Endereço 2</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setUserForm((current) => ({ ...current, secondaryAddress: event.target.value }))
                  }
                  value={userForm.secondaryAddress}
                />
              </div>
              <div>
                <label className="admin-label">Número</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setUserForm((current) => ({ ...current, secondaryNumber: event.target.value }))
                  }
                  value={userForm.secondaryNumber}
                />
              </div>
              <div>
                <label className="admin-label">Complemento</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setUserForm((current) => ({ ...current, secondaryComplement: event.target.value }))
                  }
                  value={userForm.secondaryComplement}
                />
              </div>
              <div>
                <label className="admin-label">Bairro</label>
                <input
                  className="admin-input"
                  onChange={(event) =>
                    setUserForm((current) => ({ ...current, neighborhood: event.target.value }))
                  }
                  value={userForm.neighborhood}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <label className="admin-label">Facebook</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, facebook: event.target.value }))}
                  value={userForm.facebook}
                />
              </div>
              <div>
                <label className="admin-label">Instagram</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, instagram: event.target.value }))}
                  value={userForm.instagram}
                />
              </div>
              <div>
                <label className="admin-label">YouTube</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, youtube: event.target.value }))}
                  value={userForm.youtube}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  checked={userForm.isActive}
                  onChange={(event) =>
                    setUserForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                      status: event.target.checked
                        ? ["Inativo", "Excluído"].includes(current.status)
                          ? "Ativo"
                          : current.status
                        : "Inativo"
                    }))
                  }
                  type="checkbox"
                />
                Usuário ativo
              </label>
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  checked={userForm.isSuperAdmin}
                  onChange={(event) =>
                    setUserForm((current) => ({ ...current, isSuperAdmin: event.target.checked }))
                  }
                  type="checkbox"
                />
                Super admin
              </label>
              <label className="flex items-center gap-2 text-[14px]">
                <input
                  checked={userForm.forcePasswordChange}
                  onChange={(event) =>
                    setUserForm((current) => ({ ...current, forcePasswordChange: event.target.checked }))
                  }
                  type="checkbox"
                />
                Obrigar troca de senha
              </label>
            </div>
            <div>
              <label className="admin-label">Observações</label>
              <textarea
                className="admin-textarea min-h-[120px]"
                onChange={(event) => setUserForm((current) => ({ ...current, notes: event.target.value }))}
                value={userForm.notes}
              />
            </div>
            <div>
              <label className="admin-label">Perfis vinculados</label>
              <p className="mb-3 text-[13px] text-[#666]">
                As permissões do usuário são definidas pelos grupos e perfis marcados abaixo.
              </p>
              <div className="grid gap-2 lg:grid-cols-3">
                {management.roles.map((role) => (
                  <label className="flex items-center gap-2 text-[14px]" key={role.id}>
                    <input
                      checked={userForm.roleIds.includes(role.id)}
                      onChange={() =>
                        setUserForm((current) => ({
                          ...current,
                          roleIds: toggleItem(current.roleIds, role.id)
                        }))
                      }
                      type="checkbox"
                    />
                    {role.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="border border-[#d8d8d8] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#333]">Permissões herdadas</h3>
                  <button
                    className="text-[13px] font-semibold text-[#0c67ad] hover:underline"
                    onClick={() => {
                      setTopMenu("administration");
                      setView("permissions");
                    }}
                    type="button"
                  >
                    Abrir Permissões
                  </button>
                </div>
                {selectedUserPermissionLabels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedUserPermissionLabels.map((label) => (
                      <span className="border border-[#cfe1ee] bg-[#f5fbff] px-2 py-1 text-[12px] text-[#215d85]" key={label}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#777]">Nenhuma permissão herdada. Vincule pelo menos um grupo.</p>
                )}
              </div>
              <div className="border border-[#d8d8d8] bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#333]">Aplicativos liberados</h3>
                  <button
                    className="text-[13px] font-semibold text-[#0c67ad] hover:underline"
                    onClick={() => {
                      setTopMenu("administration");
                      setView("groups");
                    }}
                    type="button"
                  >
                    Abrir Grupos
                  </button>
                </div>
                {selectedUserAppAccesses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUserAppAccesses.map((access) => (
                      <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2 text-[13px]" key={access.id}>
                        <div>
                          <div className="font-semibold text-[#333]">{access.appName}</div>
                          <div className="text-[#777]">{access.area}</div>
                        </div>
                        <div className="text-right text-[#0c67ad]">
                          {[
                            access.canCreate ? "inclui" : null,
                            access.canUpdate ? "altera" : null,
                            access.canDelete ? "exclui" : null,
                            access.canAccess ? "acessa" : null
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#777]">Nenhum aplicativo liberado pelos grupos selecionados.</p>
                )}
              </div>
            </div>
          </form>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[13px] text-[#666]">
              {selectedUserIds.length > 0 ? `${selectedUserIds.length} selecionado(s)` : `${sortedUsers.length} usuário(s)`}
            </div>
            <ActionButton disabled={selectedUserIds.length === 0} onClick={() => confirmRemoveUsers(selectedUserIds)} tone="red">
              Excluir selecionados
            </ActionButton>
          </div>
          <div className="overflow-x-auto border border-[#d8d8d8]">
            <table className="admin-table min-w-full">
              <thead>
                <tr>
                  <th className="w-[40px]">
                    <input
                      aria-label="Selecionar todos os usuários"
                      checked={allVisibleUsersSelected}
                      onChange={toggleAllVisibleUsers}
                      type="checkbox"
                    />
                  </th>
                  <th className="w-[70px]">Id</th>
                  <th>Nome</th>
                  <th>Foto</th>
                  <th>Username</th>
                  <th className="w-[90px]">CPF</th>
                  <th>E-mail</th>
                  <th>Grupos</th>
                  <th>Status</th>
                  <th className="w-[90px]">Ação</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((managedUser) => (
                  <tr className={getUserRowClassName(managedUser)} key={managedUser.id}>
                    <td>
                      <input
                        aria-label={`Selecionar ${managedUser.name}`}
                        checked={selectedUserIds.includes(managedUser.id)}
                        onChange={() =>
                          setSelectedUserIds((current) => toggleItem(current, managedUser.id))
                        }
                        type="checkbox"
                      />
                    </td>
                    <td>{displayRecordCode(managedUser.legacyId, managedUser.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => editUser(managedUser)} type="button">
                        {managedUser.name}
                      </button>
                    </td>
                    <td>
                      {managedUser.picture ? (
                       <img
                          src={`/abbatech/refresh${managedUser.picture}`}
                          alt={managedUser.username ?? ""}
                          className="w-12 h-12 object-cover cursor-zoom-in"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewImageUrl(`/abbatech/refresh${managedUser.picture}`);
                          }}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="text-[#0c67ad]">{managedUser.username ?? "-"}</td>
                    <td className="text-[#0c67ad]">{managedUser.cpf ?? "-"}</td>
                    <td className="text-[#0c67ad]">{managedUser.email}</td>
                    <td className="text-[#0c67ad]">{managedUser.roles.map((role) => role.name).join(", ")}</td>
                    <td className="text-[#0c67ad]">{managedUser.status ?? (managedUser.isActive ? "Ativo" : "Inativo")}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <button className="text-left text-[#0c67ad] hover:underline" onClick={() => editUser(managedUser)} type="button">
                          Editar
                        </button>
                        <button className="text-left text-[#c4473c] hover:underline" onClick={() => confirmRemoveUsers([managedUser.id])} type="button">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isPreviewOpen && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              
              <div className="relative w-[90vw] h-[80vh] bg-black">
                <Cropper
                  image={
                    profileTempPreview
                      ? profileTempPreview
                      : userForm.picture
                        ? `/abbatech/refresh${userForm.picture}`
                        : ""
                  }
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                />
              </div>

              <button
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded shadow-lg hover:bg-green-700 z-50"
                onClick={handleCrop}
              >
                Confirmar corte
              </button>

              <input
                type="range"
                min={1}
                max={2}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[200px] z-10"
              />

              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={() => {
                  setIsPreviewOpen(false);
                  
                  if (!profileTempImage) {
                    setProfileTempPreview("");
                  }
                }}
              >
                ✕
              </button>
            </div>
          )}

          {viewImageUrl && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <img
                src={viewImageUrl}
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />

              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={() => setViewImageUrl(null)}
              >
                ✕
              </button>
            </div>
          )}
        </section>
      );
    }

}
