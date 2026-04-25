const refreshBasePath = "/abbatech/refresh";

export function refreshAssetPath(path: `/${string}`) {
  return `${refreshBasePath}${path}`;
}

export const refreshLogoSrc = refreshAssetPath("/brand/logov2.png");
