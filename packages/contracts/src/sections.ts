import type { EntityId } from "./common";

export type SectionTreeNode = {
  id: EntityId;
  name: string;
  slug: string;
  path: string;
  children: SectionTreeNode[];
};

export type AdminSection = {
  id: EntityId;
  displayId?: number | null;
  name: string;
  slug: string;
  path: string;
  parentId: EntityId | null;
  description: string | null;
  isActive: boolean;
  visibleInMenu: boolean;
  order: number;
  visits?: number;
  _count?: {
    children: number;
    contents: number;
  };
};

export type UpsertSectionRequest = {
  name: string;
  slug?: string;
  description?: string;
  order?: number;
  visibleInMenu?: boolean;
  isActive?: boolean;
  parentId?: EntityId;
};
