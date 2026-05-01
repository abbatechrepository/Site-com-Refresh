const refreshBasePath = "/abbatech/refresh";

export function refreshAssetPath(path: `/${string}`) {
  if (path.startsWith(`${refreshBasePath}/`)) {
    return path;
  }

  return `${refreshBasePath}${path}`;
}

export function normalizeRefreshAssetPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return refreshAssetPath(normalizedPath as `/${string}`);
}

export const refreshLogoSrc = refreshAssetPath("/brand/logov2.png");
export const refreshLoginBackgroundSrc = refreshAssetPath("/brand/img-cms.png");
