"use client";

import { ActionButton } from "../ActionButton";
import { AdminModal } from "../AdminModal";
import { emptyUserForm } from "../../_lib/constants";
import { displayRecordCode, isDeletedUser, toggleItem, resolveUserPictureUrl } from "../../_lib/utils";
import type { RefreshManager } from "./moduleTypes";
import { useState, useEffect, useRef } from "react";
import { ImagePlus } from "lucide-react";
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
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
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

  const visibleUsers = sortedUsers.filter((managedUser) => !isDeletedUser(managedUser));

  const allVisibleUserIds = visibleUsers.map((managedUser) => managedUser.id);
  const allVisibleUserIdSet = new Set(allVisibleUserIds);
  const selectedUserIdSet = new Set(selectedUserIds);
  const visibleSelectedUserIds = selectedUserIds.filter((userId) => allVisibleUserIdSet.has(userId));
  const allVisibleUsersSelected =
    allVisibleUserIds.length > 0 && allVisibleUserIds.every((userId) => selectedUserIdSet.has(userId));
  const userFormPictureUrl = resolveUserPictureUrl(userForm.picture);

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
    image.crossOrigin = "anonymous";
    const src = profileTempPreview
      ? profileTempPreview
      : userFormPictureUrl
      ? userFormPictureUrl
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

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg")
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

  function closeUserModal() {
    setUserForm(emptyUserForm);
    setHighlightedUserId("");
    resetCrop();
    setIsUserModalOpen(false);
  }

  function openNewUser() {
    setUserForm(emptyUserForm);
    setHighlightedUserId("");
    resetCrop();
    setIsUserModalOpen(true);
  }

  function openEditUser(managedUser: (typeof sortedUsers)[number]) {
    resetCrop();
    editUser(managedUser);
    setIsUserModalOpen(true);
  }

  function getUserRowClassName(managedUser: (typeof sortedUsers)[number]) {
    if (managedUser.id === highlightedUserId) {
      return "[&>td]:bg-[#fff8d9]";
    }

    if (managedUser.status === "Inativo") {
      return "[&>td]:bg-[#fee2d8]/55";
    }

    if (managedUser.status === "Novo") {
      return "[&>td]:bg-[#eeffdd]/70";
    }

    return undefined;
  }

    if (view === "users") {
      return (
        <section className="space-y-6">
          <div className="admin-toolbar justify-between">
            <div>
              <div className="text-[18px] font-extrabold text-[#10233d]">
                {visibleSelectedUserIds.length > 0
                  ? `${visibleSelectedUserIds.length} selecionado(s)`
                  : `${visibleUsers.length} usuário(s)`}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton onClick={openNewUser} tone="green">
                Incluir Usuário
              </ActionButton>
              <ActionButton
                disabled={visibleSelectedUserIds.length === 0}
                onClick={() => confirmRemoveUsers(visibleSelectedUserIds)}
                tone="red"
              >
                Excluir selecionados
              </ActionButton>
            </div>
          </div>

          <AdminModal
            error={manager.error}
            isOpen={isUserModalOpen}
            onClose={() => {
              if (isPreviewOpen) {
                return;
              }

              closeUserModal();
            }}
            size="full"
            title={userForm.id ? "Editar Usuário" : "Novo Usuário"}
          >
          <form
            className="admin-modal-form space-y-4"
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

                const saved = await handleUserSubmit(e, profileTempImage);

                if (saved) {
                  resetCrop();
                  setIsUserModalOpen(false);
                }
              }
            }
            encType="multipart/form-data">
            {userForm.id ? (
              <div className="flex items-center justify-between rounded-[8px] border border-[#cfe3f3] bg-[#eef7fd] px-4 py-3 text-[14px] text-[#215d85]">
                <span>Modo de edição ativo para este usuário.</span>
                <button
                  className="font-semibold text-[#0c67ad] hover:underline"
                  onClick={closeUserModal}
                  type="button"
                >
                  Cancelar edição
                </button>
              </div>
            ) : null}
            <div>
              <label className="admin-label">
                <span className="inline-flex items-center gap-2">
                  <ImagePlus size={16} strokeWidth={2} />Foto de Perfil
                </span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  if (profileTempPreview) {
                    URL.revokeObjectURL(profileTempPreview);
                  }

                  const preview = URL.createObjectURL(file);

                  setProfileTempImage(file);
                  setProfileTempPreview(preview);

                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);

                  setIsPreviewOpen(true);
                }}
              />

              <ActionButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="inline-flex items-center gap-2">
                  <ImagePlus size={16} strokeWidth={2} />
                  Escolher imagem
                </span>
              </ActionButton>
            </div>
            {(profileTempPreview || userFormPictureUrl) && (
              <div
                className="mt-2 h-24 w-24 cursor-zoom-in overflow-hidden rounded-[8px] border border-[#d7e3f1] shadow-[0_10px_24px_rgba(15,33,57,0.1)]"
                onClick={() => {
                  if (profileTempPreview || userFormPictureUrl) {
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                    setCroppedAreaPixels(null);

                    setIsPreviewOpen(true);
                  }
                }}
              >
                <img
                  src={
                    profileTempPreview
                      ? profileTempPreview
                      : userFormPictureUrl
                        ? userFormPictureUrl
                        : undefined
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
              <div>
                <label className="admin-label">Empresa</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, company: event.target.value }))}
                  value={userForm.company}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
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
              <div>
                <label className="admin-label">Endereço</label>
                <input
                  className="admin-input"
                  onChange={(event) => setUserForm((current) => ({ ...current, address: event.target.value }))}
                  value={userForm.address}
                />
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">

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
              <div className="admin-panel p-4">
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
                      <span className="rounded-[999px] border border-[#cfe1ee] bg-[#f5fbff] px-2.5 py-1 text-[12px] font-semibold text-[#215d85]" key={label}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-[#777]">Nenhuma permissão herdada. Vincule pelo menos um grupo.</p>
                )}
              </div>
              <div className="admin-panel p-4">
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
              <div className="admin-modal-footer flex flex-wrap justify-end gap-2 lg:col-span-2">
                <ActionButton onClick={closeUserModal}>Cancelar</ActionButton>
                <ActionButton
                  onClick={() => {
                    setUserForm(emptyUserForm);
                    setHighlightedUserId("");
                    resetCrop();
                  }}
                >
                  Limpar
                </ActionButton>
                <ActionButton tone="green" type="submit">
                  {userForm.id ? "Salvar alterações" : "Incluir"}
                </ActionButton>
              </div>
            </div>
          </form>
          </AdminModal>
          <div className="admin-table-panel overflow-x-auto">
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
                {visibleUsers.map((managedUser) => {
                  const userPictureUrl = resolveUserPictureUrl(managedUser?.picture);
                  const userInitial = managedUser?.name?.trim().slice(0, 1).toUpperCase() ?? "U";
                  return (
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
                    <td>{displayRecordCode(managedUser.displayId, managedUser.id)}</td>
                    <td>
                      <button className="text-[#0c67ad] hover:underline" onClick={() => openEditUser(managedUser)}
                        type="button">
                        {managedUser.name}
                      </button>
                    </td>
                    <td>
                      {userPictureUrl ? (
                        <img
                          src={userPictureUrl}
                          alt={`Foto de ${managedUser?.name ?? "usuário"}`}
                          className="h-10 w-10 object-cover"
                        />
                      ) : (
                        <span>{userInitial}</span>
                      )}
                    </td>
                    <td className="text-[#0c67ad]">{managedUser.username ?? "-"}</td>
                    <td className="text-[#0c67ad]">{managedUser.cpf ?? "-"}</td>
                    <td className="text-[#0c67ad]">{managedUser.email}</td>
                    <td className="text-[#0c67ad]">{managedUser.roles.map((role) => role.name).join(", ")}</td>
                    <td className="text-[#0c67ad]">{managedUser.status ?? (managedUser.isActive ? "Ativo" : "Inativo")}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <button className="text-left text-[#0c67ad] hover:underline" onClick={() => openEditUser(managedUser)}
                          type="button">
                          Editar
                        </button>
                        <button className="text-left text-[#c4473c] hover:underline" onClick={() => confirmRemoveUsers([managedUser.id])} type="button">
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
          {isPreviewOpen && (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/86">

              <div className="relative h-[80vh] w-[90vw] overflow-hidden rounded-[8px] border border-white/15 bg-black shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
                <Cropper
                  image={
                    profileTempPreview
                      ? profileTempPreview
                      : userFormPictureUrl
                        ? userFormPictureUrl
                        : undefined
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
                className="absolute bottom-6 left-1/2 z-[122] -translate-x-1/2 rounded-[8px] bg-green-600 px-6 py-2 font-semibold text-white shadow-lg hover:bg-green-700"
                onClick={handleCrop}
                type="button"
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
                className="absolute bottom-20 left-1/2 z-[122] w-[200px] -translate-x-1/2"
              />

              <button
                className="absolute right-4 top-4 z-[122] flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/20 bg-white/10 text-2xl text-white hover:bg-white/20"
                onClick={() => {
                  setIsPreviewOpen(false);

                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                  setCroppedAreaPixels(null);

                  if (!profileTempImage) {
                    setProfileTempPreview("");
                  }
                }}
                type="button"
              >
                ✕
              </button>
            </div>
          )}

          {viewImageUrl && (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/86">
              <img
                src={viewImageUrl}
                className="max-w-[90vw] max-h-[90vh] object-contain"
              />

              <button
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/20 bg-white/10 text-2xl text-white hover:bg-white/20"
                onClick={() => setViewImageUrl(null)}
                type="button"
              >
                ✕
              </button>
            </div>
          )}
        </section>
      );
    }

}
