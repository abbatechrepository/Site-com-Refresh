"use client";

import { FormEvent, useCallback, useEffect } from "react";

import { emptyManagementBootstrap } from "../_lib/constants";
import { apiRequest, safeApiRequest } from "../_lib/api";
import { getDefaultNavigation, getMenuConfig } from "../_lib/utils";
import type { Content, EditorMeta, LoggedUser, ManagementBootstrap, Section } from "../_lib/types";
import type { useRefreshManagerState } from "./useRefreshManagerState";

type RefreshManagerState = ReturnType<typeof useRefreshManagerState>;

export function useRefreshManagerSession(state: RefreshManagerState) {
  const {
    identifier,
    password,
    selectedProfileId,
    setContentForm,
    setContents,
    setError,
    setSessionAlert,
    setExpandedTopMenu,
    setManagement,
    setMeta,
    setProfileMenuOpen,
    setSections,
    setSelectedProfileId,
    setSuccess,
    setToken,
    setTopMenu,
    setUser,
    setView,
    startTransition,
    token,
    user
  } = state;

  useEffect(() => {
    const storedToken = window.localStorage.getItem("refresh_access_token");

    if (storedToken) {
      setToken(storedToken);
    }
  }, [setToken]);

  const bootstrap = useCallback(
    async (accessToken: string) => {
      try {
        setError("");

        const profile = await apiRequest<LoggedUser>("/auth/me", undefined, accessToken);
        const [nextMeta, nextSections, nextContents, nextManagement] = await Promise.all([
          safeApiRequest<EditorMeta>("/contents/meta", { templates: [], sections: [], contentTypes: [] }, undefined, accessToken),
          safeApiRequest<Section[]>("/sections/admin/list", [], undefined, accessToken),
          safeApiRequest<Content[]>("/contents/admin/list", [], undefined, accessToken),
          safeApiRequest<ManagementBootstrap>("/management/bootstrap", emptyManagementBootstrap, undefined, accessToken)
        ]);

        const firstProfileId = profile.activeRoleId ?? profile.roles[0]?.id ?? "";
        const activeProfile = profile.roles.find((role) => role.id === firstProfileId) ?? profile.roles[0] ?? null;
        const initialMenuConfig = getMenuConfig(activeProfile);
        const defaultNavigation = getDefaultNavigation(activeProfile, initialMenuConfig);

        setUser(profile);
        setSelectedProfileId(firstProfileId);
        setMeta(nextMeta);
        setSections(nextSections);
        setContents(nextContents);
        setManagement(nextManagement);

        const shouldResetShell = selectedProfileId !== firstProfileId || !selectedProfileId;
        if (shouldResetShell) {
          setTopMenu(defaultNavigation.topMenu);
          setView(defaultNavigation.view);
        }

        setExpandedTopMenu(null);
        setContentForm((current) => ({
          ...current,
          sectionId: current.sectionId || nextMeta.sections[0]?.id || "",
          contentTypeId: current.contentTypeId || nextMeta.contentTypes[0]?.id || "",
          templateId: current.templateId || nextMeta.templates[0]?.id || ""
        }));
      } catch (bootstrapError) {
        if (
          bootstrapError instanceof Error &&
          "status" in bootstrapError &&
          [401, 403].includes((bootstrapError as Error & { status?: number }).status ?? 0)
        ) {
          const hadAuthenticatedSession =
            window.localStorage.getItem("refresh_authenticated_session") === "true";

          window.localStorage.removeItem("refresh_access_token");
          window.localStorage.removeItem("refresh_authenticated_session");

          setToken("");
          setUser(null);
          setError("");

          if (hadAuthenticatedSession) {
            setSessionAlert({
              title: "Sessão expirada",
              message: "Sua sessão expirou. Faça login novamente para continuar."
            });
          }

          return;
        }

        setError(bootstrapError instanceof Error ? bootstrapError.message : "Falha ao carregar o ambiente do manager.");
      }
    },
    [
      setContentForm,
      setContents,
      setError,
      setSessionAlert,
      setExpandedTopMenu,
      setManagement,
      setMeta,
      setSections,
      setSelectedProfileId,
      setToken,
      setTopMenu,
      setUser,
      setView,
      selectedProfileId,
    ]
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    startTransition(() => {
      void bootstrap(token);
    });
  }, [bootstrap, startTransition, token]);

  useEffect(() => {
    if (!user?.roles.length) {
      return;
    }

    const selectedStillExists = user.roles.some((role) => role.id === selectedProfileId);

    if (!selectedStillExists) {
      const fallbackProfile = user.roles[0];
      const fallbackMenuConfig = getMenuConfig(fallbackProfile ?? null);
      const defaultNavigation = getDefaultNavigation(fallbackProfile ?? null, fallbackMenuConfig);

      setSelectedProfileId(fallbackProfile?.id ?? "");
      setTopMenu(defaultNavigation.topMenu);
      setView(defaultNavigation.view);
    }
  }, [selectedProfileId, setSelectedProfileId, setTopMenu, setView, user]);

  const handleLogin = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest<{ accessToken: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password })
      });

      window.localStorage.setItem("refresh_access_token", response.accessToken);
      window.localStorage.setItem("refresh_authenticated_session", "true");

      setToken(response.accessToken);
      setSessionAlert(null);
      // setSuccess("Login realizado com sucesso.");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Falha ao autenticar.");
    }
  }, [identifier, password, setError, setSessionAlert, setSuccess, setToken]);

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem("refresh_access_token");
    window.localStorage.removeItem("refresh_authenticated_session");

    setToken("");
    setUser(null);
    setSessionAlert(null);
    setSuccess("");
    setError("");
  }, [setError, setSessionAlert, setSuccess, setToken, setUser]);

  const switchProfile = useCallback(async (profileId: string) => {
    const nextProfile = user?.roles.find((role) => role.id === profileId);

    if (!nextProfile) {
      return;
    }

    try {
      const nextMenuConfig = getMenuConfig(nextProfile);
      const nextNavigation = getDefaultNavigation(nextProfile, nextMenuConfig);

      const response = await apiRequest<{ accessToken: string }>(
        "/auth/switch-profile",
        {
          method: "POST",
          body: JSON.stringify({ roleId: profileId })
        },
        token
      );

      window.localStorage.setItem("refresh_access_token", response.accessToken);
      setToken(response.accessToken);
      setSelectedProfileId(profileId);
      setTopMenu(nextNavigation.topMenu);
      setView(nextNavigation.view);
      setProfileMenuOpen(false);
      setExpandedTopMenu(null);
      setSuccess(`Perfil ativo: ${nextProfile.name}`);
    } catch (switchError) {
      setError(switchError instanceof Error ? switchError.message : "Falha ao trocar o perfil.");
    }
  }, [
    setError,
    setExpandedTopMenu,
    setProfileMenuOpen,
    setSelectedProfileId,
    setSuccess,
    setToken,
    setTopMenu,
    setView,
    token,
    user
  ]);

  return {
    bootstrap,
    handleLogin,
    handleLogout,
    switchProfile
  };
}
