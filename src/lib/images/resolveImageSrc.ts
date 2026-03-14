const BASE64_IMAGE_SIGNATURES: Array<{ prefix: string; mimeType: string }> = [
  { prefix: '/9j/', mimeType: 'image/jpeg' },
  { prefix: 'iVBOR', mimeType: 'image/png' },
  { prefix: 'R0lGOD', mimeType: 'image/gif' },
  { prefix: 'UklGR', mimeType: 'image/webp' },
  { prefix: 'PHN2Zy', mimeType: 'image/svg+xml' },
];

function inferMimeType(base64Value: string) {
  const normalized = base64Value.trim();

  return (
    BASE64_IMAGE_SIGNATURES.find(({ prefix }) => normalized.startsWith(prefix))
      ?.mimeType || 'image/jpeg'
  );
}

function looksLikeRawBase64(value: string) {
  const normalized = value.replace(/\s+/g, '');

  if (!normalized || normalized.length < 32) return false;
  if (normalized.includes('://')) return false;
  if (normalized.startsWith('data:')) return false;

  return /^[A-Za-z0-9+/=]+$/.test(normalized);
}

export function resolveImageSrc(value?: string | null, fallback = ''): string {
  if (!value) return fallback;

  const normalized = value.trim();

  if (!normalized) return fallback;
  if (looksLikeRawBase64(normalized)) {
    return `data:${inferMimeType(normalized)};base64,${normalized}`;
  }
  if (
    normalized.startsWith('data:') ||
    normalized.startsWith('blob:') ||
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('/')
  ) {
    return normalized;
  }

  return normalized || fallback;
}
