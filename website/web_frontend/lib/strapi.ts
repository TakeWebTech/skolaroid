type StrapiResponse<T> = {
  data: T;
};

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export function isStrapiConfigured() {
  return Boolean(STRAPI_URL);
}

export async function fetchStrapi<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!STRAPI_URL) return null;
  const url = new URL(path.replace(/^\//, ''), STRAPI_URL.endsWith('/') ? STRAPI_URL : `${STRAPI_URL}/`);

  const response = await fetch(url, {
    ...init,
    headers: {
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...(init?.headers ?? {}),
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    console.warn(`Strapi request failed: ${url.pathname} ${response.status}`);
    return null;
  }

  const body = (await response.json()) as StrapiResponse<T>;
  return body.data;
}

export function strapiAttributes<T extends { attributes?: unknown }>(entry: T): T['attributes'] {
  return entry?.attributes;
}
