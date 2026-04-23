import type { PublicContent, SectionTreeNode } from "@abbatech/contracts";

const publicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api/v1";
const internalApiUrl = process.env.INTERNAL_API_URL ?? publicApiUrl;

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${internalApiUrl}${path}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar ${path}`);
  }

  return response.json() as Promise<T>;
}

export function getPortalApiUrl() {
  return publicApiUrl;
}

export function getSections() {
  return request<SectionTreeNode[]>("/sections");
}

export function getPublishedContents() {
  return request<PublicContent[]>("/contents");
}

export function getContentBySlug(slug: string) {
  return request<PublicContent>(`/contents/${slug}`);
}
