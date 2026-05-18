const PRINTFUL_CDN_HOST = "files.cdn.printful.com";
const PATCH_FALLBACK_IMAGE = "/images/patches/rebirth-oval-patch-1.webp";

export function resolveProductImage(image?: string | null): string | null {
  if (!image) return null;

  try {
    if (new URL(image).hostname === PRINTFUL_CDN_HOST) {
      return PATCH_FALLBACK_IMAGE;
    }
  } catch {
    return image;
  }

  return image;
}
