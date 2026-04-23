"use client";

import { useState, useTransition } from "react";

import {
  emptyApplicationForm,
  emptyContentForm,
  emptyContentTypeForm,
  emptyElementForm,
  emptyRoleForm,
  emptySectionForm,
  emptySystemEmailForm,
  emptyTemplateForm,
  emptyUserForm,
  emptyPermissionForm
} from "../_lib/constants";
import type {
  ApplicationFormState,
  Content,
  ContentFormState,
  ContentTypeFormState,
  EditorMeta,
  ElementFormState,
  LoggedUser,
  ManagementBootstrap,
  PermissionFormState,
  RoleFormState,
  Section,
  SectionFormState,
  SystemEmailFormState,
  TemplateFormState,
  TopMenuKey,
  UserFormState,
  ViewKey
} from "../_lib/types";

export function useRefreshManagerState() {
  const [token, setToken] = useState("");
  const [identifier, setIdentifier] = useState("admin@abbatech.local");
  const [password, setPassword] = useState("Refresh123!");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState<LoggedUser | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [meta, setMeta] = useState<EditorMeta>({
    sections: [],
    templates: [],
    contentTypes: []
  });
  const [management, setManagement] = useState<ManagementBootstrap>({
    contentTypes: [],
    users: [],
    roles: [],
    permissions: [],
    applications: [],
    roleApplicationAccesses: [],
    systemEmails: [],
    templates: [],
    elements: [],
    newsletterGroups: [],
    newsletterCampaigns: [],
    privacyRequests: []
  });
  const [sectionForm, setSectionForm] = useState<SectionFormState>(emptySectionForm);
  const [contentForm, setContentForm] = useState<ContentFormState>(emptyContentForm);
  const [contentTypeForm, setContentTypeForm] = useState<ContentTypeFormState>(emptyContentTypeForm);
  const [permissionForm, setPermissionForm] = useState<PermissionFormState>(emptyPermissionForm);
  const [applicationForm, setApplicationForm] = useState<ApplicationFormState>(emptyApplicationForm);
  const [roleForm, setRoleForm] = useState<RoleFormState>(emptyRoleForm);
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm);
  const [templateForm, setTemplateForm] = useState<TemplateFormState>(emptyTemplateForm);
  const [elementForm, setElementForm] = useState<ElementFormState>(emptyElementForm);
  const [systemEmailForm, setSystemEmailForm] = useState<SystemEmailFormState>(emptySystemEmailForm);
  const [highlightedUserId, setHighlightedUserId] = useState("");
  const [view, setView] = useState<ViewKey>("content-list");
  const [topMenu, setTopMenu] = useState<TopMenuKey>("content");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [expandedTopMenu, setExpandedTopMenu] = useState<TopMenuKey | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState("");
  const [isPending, startTransition] = useTransition();

  return {
    token,
    setToken,
    identifier,
    setIdentifier,
    password,
    setPassword,
    error,
    setError,
    success,
    setSuccess,
    user,
    setUser,
    sections,
    setSections,
    contents,
    setContents,
    meta,
    setMeta,
    management,
    setManagement,
    sectionForm,
    setSectionForm,
    contentForm,
    setContentForm,
    contentTypeForm,
    setContentTypeForm,
    permissionForm,
    setPermissionForm,
    applicationForm,
    setApplicationForm,
    roleForm,
    setRoleForm,
    userForm,
    setUserForm,
    templateForm,
    setTemplateForm,
    elementForm,
    setElementForm,
    systemEmailForm,
    setSystemEmailForm,
    highlightedUserId,
    setHighlightedUserId,
    view,
    setView,
    topMenu,
    setTopMenu,
    selectedProfileId,
    setSelectedProfileId,
    expandedTopMenu,
    setExpandedTopMenu,
    profileMenuOpen,
    setProfileMenuOpen,
    editingSectionId,
    setEditingSectionId,
    isPending,
    startTransition
  };
}
