"use client";

import { AccessModules } from "./modules/AccessModules";
import { ContentModules } from "./modules/ContentModules";
import { DesignModules } from "./modules/DesignModules";
import { SystemModules } from "./modules/SystemModules";
import { UserModules } from "./modules/UserModules";
import type { useRefreshManager } from "../_hooks/useRefreshManager";

type RefreshManager = ReturnType<typeof useRefreshManager>;

export function RefreshModules(props: { manager: RefreshManager }) {
  const { view } = props.manager;

  if (["content-list", "content-editor", "sections-tree", "section-editor"].includes(view)) {
    return <ContentModules manager={props.manager} />;
  }

  if (["masks", "templates", "elements"].includes(view)) {
    return <DesignModules manager={props.manager} />;
  }

  if (["permissions", "groups"].includes(view)) {
    return <AccessModules manager={props.manager} />;
  }

  if (view === "users") {
    return <UserModules manager={props.manager} />;
  }

  return <SystemModules manager={props.manager} />;
}
