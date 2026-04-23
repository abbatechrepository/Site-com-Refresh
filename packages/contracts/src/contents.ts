import type { EntityId } from "./common";

export type ContentStatus = "draft" | "published" | "archived";
export type ContentVisibility = "public" | "private";

export type SeoSummary = {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string | null;
  robots?: string | null;
};

export type PublicContent = {
  id: EntityId;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  publishedAt: string | null;
  section: {
    id: EntityId;
    name: string;
    path: string;
  };
  seo: SeoSummary | null;
  template: {
    id: EntityId;
    name: string;
  } | null;
};

export type AdminContent = {
  id: EntityId;
  legacyId?: number | null;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  status: ContentStatus | string;
  visibility: ContentVisibility | string;
  publishedAt: string | null;
  sectionId: EntityId;
  contentTypeId: EntityId;
  templateId: EntityId | null;
  section: {
    id: EntityId;
    name: string;
  };
  contentType: {
    id: EntityId;
    name: string;
  };
  seo: SeoSummary | null;
  author?: {
    id: EntityId;
    name: string;
  } | null;
};

export type ContentEditorMeta = {
  sections: Array<{
    id: EntityId;
    name: string;
    slug: string;
    path: string;
  }>;
  templates: Array<{
    id: EntityId;
    name: string;
    slug: string;
  }>;
  contentTypes: Array<{
    id: EntityId;
    name: string;
    slug: string;
  }>;
};

export type UpsertContentRequest = {
  title: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  status?: ContentStatus;
  visibility?: ContentVisibility;
  sectionId: EntityId;
  contentTypeId: EntityId;
  templateId?: EntityId | null;
  featuredMediaId?: EntityId | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonicalUrl?: string;
  seoRobots?: string;
};
