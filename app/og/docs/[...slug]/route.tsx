import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { appName, getPageImageUrl } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: appName,
    primaryColor: '#376CFF',
    primaryTextColor: '#FFFFFF',
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.7697 20.3216C1.6618 19.5259 0.7637 17.7750 0.7637 16.4109L0.7637 9.6015C0.7637 8.2374 1.6618 6.4866 2.7697 5.6908L8.6899 1.4389C9.7978 0.6432 11.3020 0.9232 12.0494 2.0642L19.2206 13.0110C19.2688 13.0846 19.3079 13.0730 19.3079 12.9850L19.3079 3.7939C19.3079 3.7059 19.3659 3.6761 19.4373 3.7275L24.9961 7.7198C26.1041 8.5156 27.0022 10.2664 27.0022 11.6305L27.0022 18.4399C27.0022 19.8040 26.1041 21.5549 24.9961 22.3506L19.0760 26.6025C17.9680 27.3982 16.4639 27.1183 15.7164 25.9772L8.5453 15.0304C8.4971 14.9568 8.4580 14.9685 8.4580 15.0565L8.4580 24.2476C8.4580 24.3356 8.4000 24.3653 8.3285 24.3139Z"
          fill="#FFFFFF"
        />
      </svg>
    ),
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
