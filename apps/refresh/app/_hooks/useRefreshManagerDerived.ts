"use client";

import { useMemo } from "react";

import {
  buildSectionTree,
  getMenuConfig,
  getPermissionLabel
} from "../_lib/utils";
import type { useRefreshManagerState } from "./useRefreshManagerState";

type RefreshManagerState = ReturnType<typeof useRefreshManagerState>;

export function useRefreshManagerDerived(state: RefreshManagerState) {
  const activeProfile = useMemo(
    () => state.user?.roles.find((role) => role.id === state.selectedProfileId) ?? state.user?.roles[0] ?? null,
    [state.selectedProfileId, state.user]
  );

  const activeMenuConfig = useMemo(() => getMenuConfig(activeProfile), [activeProfile]);
  const topMenus = activeMenuConfig.topMenus;
  const sectionTree = useMemo(() => buildSectionTree(state.sections), [state.sections]);

  const selectedUserRoles = useMemo(
    () => state.management.roles.filter((role) => state.userForm.roleIds.includes(role.id)),
    [state.management.roles, state.userForm.roleIds]
  );

  const selectedUserPermissionCodes = useMemo(
    () =>
      Array.from(
        new Set(selectedUserRoles.flatMap((role) => role.permissions.map((permission) => permission.code)))
      ).sort(),
    [selectedUserRoles]
  );

  const selectedUserPermissionLabels = useMemo(
    () => selectedUserPermissionCodes.map(getPermissionLabel),
    [selectedUserPermissionCodes]
  );

  const selectedUserAppAccesses = useMemo(
    () =>
      Array.from(
        new Map(
          selectedUserRoles
            .flatMap((role) => role.appAccesses.filter((access) => access.canAccess))
            .map((access) => [access.appId, access])
        ).values()
      ).sort((left, right) => `${left.area}:${left.appName}`.localeCompare(`${right.area}:${right.appName}`)),
    [selectedUserRoles]
  );

  const sortedUsers = useMemo(
    () =>
      [...state.management.users].sort((left, right) => {
        if (state.highlightedUserId && left.id === state.highlightedUserId) {
          return -1;
        }

        if (state.highlightedUserId && right.id === state.highlightedUserId) {
          return 1;
        }

        const byName = left.name.localeCompare(right.name, "pt-BR", { sensitivity: "base" });
        if (byName !== 0) {
          return byName;
        }

        return (left.legacyId ?? 0) - (right.legacyId ?? 0);
      }),
    [state.highlightedUserId, state.management.users]
  );

  const availableContentTypes = useMemo(
    () => (state.management.contentTypes.length > 0 ? state.management.contentTypes : state.meta.contentTypes),
    [state.management.contentTypes, state.meta.contentTypes]
  );

  return {
    activeProfile,
    activeMenuConfig,
    topMenus,
    sectionTree,
    selectedUserPermissionLabels,
    selectedUserAppAccesses,
    sortedUsers,
    availableContentTypes
  };
}
