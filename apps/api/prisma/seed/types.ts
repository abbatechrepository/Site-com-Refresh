export type SeedSection = {
  name: string;
  slug: string;
  description: string;
  order: number;
  parentSlug?: string;
};

export type SeedContent = {
  title: string;
  slug: string;
  excerpt: string;
  body: string[];
  sectionSlug: string;
  contentTypeSlug: string;
  seoDescription: string;
  keywords: string;
};
