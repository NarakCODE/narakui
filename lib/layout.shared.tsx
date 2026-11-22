import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { RakfoundLogo } from '@/components/rakfound-logo';
import { gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <RakfoundLogo />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
