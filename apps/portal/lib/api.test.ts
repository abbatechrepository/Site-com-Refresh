import { afterEach, describe, expect, it, vi } from "vitest";

import { getContentBySlug, getPortalApiUrl, getPublishedContents, getSections } from "./api";

describe("portal api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the public api url helper", () => {
    expect(getPortalApiUrl()).toContain("/api/v1");
  });

  it("requests sections and published contents", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: "section-1", name: "Home", slug: "home", path: "/home", children: [] }]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "content-1",
            title: "Hello",
            slug: "hello",
            excerpt: "excerpt",
            body: "body",
            publishedAt: null,
            section: { id: "section-1", name: "Home", path: "/home" },
            seo: null,
            template: null
          }
        ]
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "content-1",
          title: "Hello",
          slug: "hello",
          excerpt: "excerpt",
          body: "body",
          publishedAt: null,
          section: { id: "section-1", name: "Home", path: "/home" },
          seo: null,
          template: null
        })
      });

    vi.stubGlobal("fetch", fetchMock);

    const sections = await getSections();
    const contents = await getPublishedContents();
    const content = await getContentBySlug("hello");

    expect(sections).toHaveLength(1);
    expect(contents[0]?.slug).toBe("hello");
    expect(content.title).toBe("Hello");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
