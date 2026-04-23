"use client";

import { useRefreshManagerDerived } from "./useRefreshManagerDerived";
import { useRefreshManagerEditors } from "./useRefreshManagerEditors";
import { useRefreshManagerMutations } from "./useRefreshManagerMutations";
import { useRefreshManagerSession } from "./useRefreshManagerSession";
import { useRefreshManagerState } from "./useRefreshManagerState";

export function useRefreshManager() {
  const state = useRefreshManagerState();
  const derived = useRefreshManagerDerived(state);
  const editors = useRefreshManagerEditors(state);
  const session = useRefreshManagerSession(state);
  const mutations = useRefreshManagerMutations(state, session, editors);

  return {
    ...state,
    ...derived,
    ...session,
    ...editors,
    ...mutations
  };
}
