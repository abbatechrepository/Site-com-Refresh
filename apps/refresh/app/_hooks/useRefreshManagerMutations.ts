"use client";

import { FormEvent } from "react";

import {
  emptyApplicationForm,
  emptyContentTypeForm,
  emptyElementForm,
  emptyPermissionForm,
  emptyPermissionCodeForm,
  emptyRoleForm,
  emptySectionForm,
  emptySystemEmailForm,
  emptyTemplateForm,
  emptyUserForm,
  menuGroups
} from "../_lib/constants";
import { apiRequest } from "../_lib/api";
import { buildDuplicateUserMessage, normalizeIdentityValue } from "../_lib/utils";
import type { ManagedUser, TopMenuKey, ViewKey } from "../_lib/types";
import type { useRefreshManagerEditors } from "./useRefreshManagerEditors";
import type { useRefreshManagerSession } from "./useRefreshManagerSession";
import type { useRefreshManagerState } from "./useRefreshManagerState";

type RefreshManagerState = ReturnType<typeof useRefreshManagerState>;
type RefreshManagerSession = ReturnType<typeof useRefreshManagerSession>;
type RefreshManagerEditors = ReturnType<typeof useRefreshManagerEditors>;

export function useRefreshManagerMutations(
  state: RefreshManagerState,
  session: RefreshManagerSession,
  editors: RefreshManagerEditors
) {
  function isAuthenticationError(error: unknown) {
    return (
      error instanceof Error &&
      "status" in error &&
      [401, 403].includes((error as Error & { status?: number }).status ?? 0)
    );
  }

  function expireSession() {
    window.localStorage.removeItem("refresh_access_token");
    window.localStorage.removeItem("refresh_authenticated_session");

    state.setToken("");
    state.setUser(null);
    state.setError("");
    state.setSuccess("");
    state.setSessionAlert({
      title: "Sessão expirada",
      message: "Faça login novamente para continuar."
    });
  }

  async function handleSectionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.editingSectionId ? `/sections/admin/${state.editingSectionId}` : "/sections/admin";
      const method = state.editingSectionId ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.sectionForm.name,
            slug: state.sectionForm.slug || undefined,
            description: state.sectionForm.description || undefined,
            order: Number(state.sectionForm.order),
            parentId: state.sectionForm.parentId || undefined,
            visibleInMenu: state.sectionForm.visibleInMenu,
            isActive: state.sectionForm.isActive
          })
        },
        state.token
      );

      state.setSectionForm(emptySectionForm);
      state.setEditingSectionId("");
      await session.bootstrap(state.token);
      state.setSuccess(state.editingSectionId ? "Seção atualizada com sucesso." : "Seção cadastrada com sucesso.");
      state.setView("sections-tree");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar seção.");
      return false;
    }
  }

  async function handleContentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.contentForm.id ? `/contents/admin/${state.contentForm.id}` : "/contents/admin";
      const method = state.contentForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            title: state.contentForm.title,
            slug: state.contentForm.slug || undefined,
            excerpt: state.contentForm.excerpt || undefined,
            body: state.contentForm.body || undefined,
            status: state.contentForm.status,
            visibility: state.contentForm.visibility,
            sectionId: state.contentForm.sectionId,
            contentTypeId: state.contentForm.contentTypeId,
            templateId: state.contentForm.templateId || undefined,
            seoTitle: state.contentForm.seoTitle || undefined,
            seoDescription: state.contentForm.seoDescription || undefined,
            seoKeywords: state.contentForm.seoKeywords || undefined,
            seoCanonicalUrl: state.contentForm.seoCanonicalUrl || undefined,
            seoRobots: state.contentForm.seoRobots || undefined
          })
        },
        state.token
      );

      editors.resetContentForm();
      await session.bootstrap(state.token);
      state.setSuccess("Conteúdo salvo com sucesso.");
      state.setView("content-list");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar conteúdo.");
      return false;
    }
  }

  async function handleContentTypeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.contentTypeForm.id
        ? `/management/content-types/${state.contentTypeForm.id}`
        : "/management/content-types";
      const method = state.contentTypeForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.contentTypeForm.name,
            slug: state.contentTypeForm.slug || undefined,
            description: state.contentTypeForm.description || undefined,
            allowRichText: state.contentTypeForm.allowRichText,
            allowFeaturedMedia: state.contentTypeForm.allowFeaturedMedia
          })
        },
        state.token
      );

      state.setContentTypeForm(emptyContentTypeForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.contentTypeForm.id ? "Máscara atualizada com sucesso." : "Máscara criada com sucesso.");
      state.setTopMenu("content");
      state.setView("masks");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar máscara.");
      return false;
    }
  }

  async function handlePermissionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.permissionForm.id
        ? `/management/role-application-accesses/${state.permissionForm.id}`
        : "/management/role-application-accesses";
      const method = state.permissionForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            roleId: state.permissionForm.roleId,
            appId: state.permissionForm.appId,
            canCreate: state.permissionForm.canCreate,
            canUpdate: state.permissionForm.canUpdate,
            canDelete: state.permissionForm.canDelete,
            canAccess: state.permissionForm.canAccess
          })
        },
        state.token
      );

      state.setPermissionForm(emptyPermissionForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.permissionForm.id ? "Permissão atualizada com sucesso." : "Permissão criada com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar permissão.");
      return false;
    }
  }

  async function handlePermissionCodeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.permissionCodeForm.id
        ? `/management/permissions/${state.permissionCodeForm.id}`
        : "/management/permissions";
      const method = state.permissionCodeForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            code: state.permissionCodeForm.code,
            description: state.permissionCodeForm.description || undefined
          })
        },
        state.token
      );

      state.setPermissionCodeForm(emptyPermissionCodeForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.permissionCodeForm.id ? "Permissão atualizada com sucesso." : "Permissão criada com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar permissão.");
      return false;
    }
  }

  async function handleApplicationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.applicationForm.id ? `/management/applications/${state.applicationForm.id}` : "/management/applications";
      const method = state.applicationForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.applicationForm.name,
            area: state.applicationForm.area,
            link: state.applicationForm.link,
            description: state.applicationForm.description || undefined
          })
        },
        state.token
      );

      state.setApplicationForm(emptyApplicationForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.applicationForm.id ? "Aplicativo atualizado com sucesso." : "Aplicativo criado com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar aplicativo.");
      return false;
    }
  }

  async function handleRoleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.roleForm.id ? `/management/roles/${state.roleForm.id}` : "/management/roles";
      const method = state.roleForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.roleForm.name,
            description: state.roleForm.description || undefined,
            functionName: state.roleForm.functionName || undefined,
            status: state.roleForm.status,
            parentRoleId: state.roleForm.parentRoleId || undefined,
            permissionIds: state.roleForm.permissionIds,
            menuAccesses: (Object.entries(menuGroups) as Array<[TopMenuKey, Array<{ key: ViewKey; label: string }>]>) 
              .flatMap(([topMenuKey, items]) =>
                items
                  .filter((item) => state.roleForm.menuAccessKeys.includes(`${topMenuKey}:${item.key}`))
                  .map((item) => ({
                    topMenu: topMenuKey,
                    viewKey: item.key
                  }))
              ),
            sectionIds: state.roleForm.sectionIds,
            contentTypeIds: state.roleForm.contentTypeIds
          })
        },
        state.token
      );

      state.setRoleForm(emptyRoleForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.roleForm.id ? "Perfil atualizado com sucesso." : "Perfil criado com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar perfil.");
      return false;
    }
  }

  async function handleSystemEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.systemEmailForm.id ? `/management/system-emails/${state.systemEmailForm.id}` : "/management/system-emails";
      const method = state.systemEmailForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.systemEmailForm.name,
            email: state.systemEmailForm.email,
            area: state.systemEmailForm.area,
            description: state.systemEmailForm.description || undefined,
            value: state.systemEmailForm.value || undefined
          })
        },
        state.token
      );

      state.setSystemEmailForm(emptySystemEmailForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.systemEmailForm.id ? "Email atualizado com sucesso." : "Email criado com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar email.");
      return false;
    }
  }

  async function resetStatistics() {
    state.setError("");
    state.setSuccess("");

    try {
      await apiRequest("/management/statistics/reset", { method: "POST" }, state.token);
      await session.bootstrap(state.token);
      state.setSuccess("Estatísticas zeradas com sucesso.");
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao zerar estatísticas.");
    }
  }

  async function handleUserSubmit(event: FormEvent<HTMLFormElement>, profileTempImage?: File | null) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const trimmedName = state.userForm.name.trim();
      const trimmedEmail = state.userForm.email.trim();
      const trimmedUsername = state.userForm.username.trim();
      const shouldValidatePassword =
        !state.userForm.id || Boolean(state.userForm.password) || Boolean(state.userForm.passwordConfirmation);

      if (!trimmedName) {
        state.setError("Você precisa informar o nome.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
      }

      if (!trimmedEmail) {
        state.setError("Você precisa informar o e-mail.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
      }

      if (!trimmedUsername) {
        state.setError("Você precisa informar o username.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
      }

      if (shouldValidatePassword) {
        if (!state.userForm.password) {
          state.setError("Você precisa informar a senha.");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return false;
        }

        if (state.userForm.password !== state.userForm.passwordConfirmation) {
          state.setError("Senha informada não confere.");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return false;
        }

        if (state.userForm.password.length < 6) {
          state.setError("A senha deve ter no mínimo seis caracteres.");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return false;
        }
      }

      const normalizedEmail = normalizeIdentityValue(trimmedEmail);
      const normalizedUsername = normalizeIdentityValue(trimmedUsername);
      const normalizedCpf = state.userForm.cpf.replace(/\D/g, "");
      const conflictingUser = state.management.users.find((managedUser) => {
        if (state.userForm.id && managedUser.id === state.userForm.id) {
          return false;
        }

        const managedEmail = normalizeIdentityValue(managedUser.email);
        const managedUsername = normalizeIdentityValue(managedUser.username ?? "");
        const managedCpf = (managedUser.cpf ?? "").replace(/\D/g, "");

        return (
          (normalizedEmail && managedEmail === normalizedEmail) ||
          (normalizedUsername && managedUsername === normalizedUsername) ||
          (normalizedCpf && managedCpf === normalizedCpf)
        );
      });

      if (conflictingUser) {
        handleConflictingUser(conflictingUser, normalizedUsername, normalizedCpf);
        return false;
      }

      const path = state.userForm.id ? `/management/users/${state.userForm.id}` : "/management/users";
      const method = state.userForm.id ? "PATCH" : "POST";

      const formData = new FormData();

      formData.append("name", trimmedName);
      formData.append("email", trimmedEmail);
      formData.append("username", trimmedUsername);

      if (state.userForm.cpf) formData.append("cpf", state.userForm.cpf);
      if (state.userForm.cnh) formData.append("cnh", state.userForm.cnh);

      formData.append("status", state.userForm.status);

      if (state.userForm.company) formData.append("company", state.userForm.company);
      if (state.userForm.jobTitle) formData.append("jobTitle", state.userForm.jobTitle);
      if (state.userForm.phone) formData.append("phone", state.userForm.phone);
      if (state.userForm.address) formData.append("address", state.userForm.address);
      if (state.userForm.zipCode) formData.append("zipCode", state.userForm.zipCode);
      if (state.userForm.city) formData.append("city", state.userForm.city);
      if (state.userForm.state) formData.append("state", state.userForm.state);

      if (state.userForm.secondaryAddress) formData.append("secondaryAddress", state.userForm.secondaryAddress);
      if (state.userForm.secondaryNumber) formData.append("secondaryNumber", state.userForm.secondaryNumber);
      if (state.userForm.secondaryComplement) formData.append("secondaryComplement", state.userForm.secondaryComplement);
      if (state.userForm.neighborhood) formData.append("neighborhood", state.userForm.neighborhood);

      if (state.userForm.notes) formData.append("notes", state.userForm.notes);

      if (state.userForm.facebook) formData.append("facebook", state.userForm.facebook);
      if (state.userForm.instagram) formData.append("instagram", state.userForm.instagram);
      if (state.userForm.youtube) formData.append("youtube", state.userForm.youtube);

      formData.append("forcePasswordChange", String(state.userForm.forcePasswordChange));
      formData.append("isActive", String(state.userForm.isActive));
      formData.append("isSuperAdmin", String(state.userForm.isSuperAdmin));

      if (state.userForm.password) {
        formData.append("password", state.userForm.password);
      }

      state.userForm.roleIds.forEach((id) => {
        formData.append("roleIds[]", id);
      });

      if (profileTempImage) {
        formData.append("file", profileTempImage);
      }

      const savedUser = await apiRequest<ManagedUser>(
        path,
        {
          method,
          body: formData
        },
        state.token
      );

      state.setHighlightedUserId(savedUser.id);
      state.setUserForm(emptyUserForm);
      state.setSelectedUserIds([]);
      await session.bootstrap(state.token);
      state.setSuccess(state.userForm.id ? "Usuário atualizado com sucesso." : "Usuário criado com sucesso.");
      return true;
    } catch (submitError) {
      if (isAuthenticationError(submitError)) {
        expireSession();
        return false;
      }

      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar usuário.");
      return false;
    }
  }

  function handleConflictingUser(conflictingUser: ManagedUser, normalizedUsername: string, normalizedCpf: string) {
    if (normalizedUsername && normalizeIdentityValue(conflictingUser.username ?? "") === normalizedUsername) {
      state.setHighlightedUserId(conflictingUser.id);
      state.setError(buildDuplicateUserMessage(conflictingUser, "username", state.userForm.username));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (normalizedCpf && (conflictingUser.cpf ?? "").replace(/\D/g, "") === normalizedCpf) {
      state.setHighlightedUserId(conflictingUser.id);
      state.setError(buildDuplicateUserMessage(conflictingUser, "cpf", state.userForm.cpf));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    state.setHighlightedUserId(conflictingUser.id);
    state.setError(buildDuplicateUserMessage(conflictingUser, "email", state.userForm.email));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleTemplateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.templateForm.id ? `/management/templates/${state.templateForm.id}` : "/management/templates";
      const method = state.templateForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.templateForm.name,
            slug: state.templateForm.slug || undefined,
            description: state.templateForm.description || undefined,
            componentKey: state.templateForm.componentKey || undefined,
            isActive: state.templateForm.isActive
          })
        },
        state.token
      );

      state.setTemplateForm(emptyTemplateForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.templateForm.id ? "Template atualizado com sucesso." : "Template criado com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar template.");
      return false;
    }
  }

  async function handleElementSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    state.setError("");
    state.setSuccess("");

    try {
      const path = state.elementForm.id ? `/management/elements/${state.elementForm.id}` : "/management/elements";
      const method = state.elementForm.id ? "PATCH" : "POST";

      await apiRequest(
        path,
        {
          method,
          body: JSON.stringify({
            name: state.elementForm.name,
            thumbLabel: state.elementForm.thumbLabel || undefined,
            category: state.elementForm.category || undefined,
            status: state.elementForm.status,
            content: state.elementForm.content
          })
        },
        state.token
      );

      state.setElementForm(emptyElementForm);
      await session.bootstrap(state.token);
      state.setSuccess(state.elementForm.id ? "Elemento atualizado com sucesso." : "Elemento criado com sucesso.");
      return true;
    } catch (submitError) {
      state.setError(submitError instanceof Error ? submitError.message : "Falha ao salvar elemento.");
      return false;
    }
  }

  async function removeEntity(path: string, successMessage: string) {
    state.setError("");
    state.setSuccess("");

    try {
      await apiRequest(path, { method: "DELETE" }, state.token);
      await session.bootstrap(state.token);
      state.setSuccess(successMessage);
    } catch (removeError) {
      state.setError(removeError instanceof Error ? removeError.message : "Falha ao excluir registro.");
    }
  }

  async function removeUsers(userIds: string[]) {
    state.setError("");
    state.setSuccess("");

    if (userIds.length === 0) {
      state.setError("Selecione pelo menos um usuário para excluir.");
      return;
    }

    try {
      await Promise.all(
        userIds.map((userId) => apiRequest(`/management/users/${userId}`, { method: "DELETE" }, state.token))
      );
      state.setSelectedUserIds([]);
      if (userIds.includes(state.highlightedUserId)) {
        state.setHighlightedUserId("");
      }
      await session.bootstrap(state.token);
      state.setSuccess(userIds.length === 1 ? "Usuário excluído com sucesso." : "Usuários excluídos com sucesso.");
    } catch (removeError) {
      state.setError(removeError instanceof Error ? removeError.message : "Falha ao excluir usuários.");
    }
  }

  return {
    handleSectionSubmit,
    handleContentSubmit,
    handleContentTypeSubmit,
    handlePermissionSubmit,
    handlePermissionCodeSubmit,
    handleApplicationSubmit,
    handleRoleSubmit,
    handleSystemEmailSubmit,
    resetStatistics,
    handleUserSubmit,
    handleTemplateSubmit,
    handleElementSubmit,
    removeEntity,
    removeUsers
  };
}
