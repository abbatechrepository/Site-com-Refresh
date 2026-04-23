import type { EntityId } from "./common";

export type RoleMenuAccess = {
  topMenu: string;
  viewKey: string;
};

export type RoleAppAccess = {
  id: EntityId;
  name: string;
  area: string;
  link: string;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  canAccess: boolean;
};

export type AuthRole = {
  id: EntityId;
  name: string;
  description: string | null;
  functionName?: string | null;
  status?: string | null;
  menuAccesses: RoleMenuAccess[];
  appAccesses: RoleAppAccess[];
  permissions: string[];
};

export type AuthenticatedUserProfile = {
  id: EntityId;
  name: string;
  email: string;
  username?: string | null;
  cpf?: string | null;
  permissions: string[];
  activeRoleId?: string | null;
  roles: AuthRole[];
};

export type LoginResponse = {
  accessToken: string;
  user: {
    id: EntityId;
    name: string;
    email: string;
    username?: string | null;
    cpf?: string | null;
    permissions: string[];
    activeRoleId?: string | null;
  };
};

export type SwitchProfileResponse = {
  accessToken: string;
};
