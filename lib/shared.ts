import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'NarakUI';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ui.narakcode.dev'
).replace(/\/+$/, '');
export const registryNamespace = '@narakui';
export const registryUrlTemplate = `${siteUrl}/r/{name}.json`;

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: 'fuma-nama',
  repo: 'fumadocs',
  branch: 'main',
};

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
