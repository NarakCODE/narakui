import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { NarakUILogo } from '@/components/narak-logo';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <NarakUILogo />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
