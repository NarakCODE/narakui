'use client';

import { forwardRef } from 'react';
import {
  FastLink as BaseFastLink,
  FastLinkRegion as BaseFastLinkRegion,
  type FastLinkProps,
  type FastLinkRegionProps,
  type FastNavigationPolicy,
} from '@fast-link/next';

/**
 * Classifies routes owned by the NarakUI App Router (`/` and `/docs/*` pages)
 * vs non-page handlers/static files (`/llms.txt`, `/llms-full.txt`, `/llms.mdx/*`,
 * `/api/*`, `/og/*`, `/r/*`, `*.md`, `*.txt`, `*.json`).
 */
export function ownsAppRoute(url: URL): boolean {
  const { pathname } = url;

  if (pathname === '/' || pathname === '/brand' || pathname === '/docs') {
    return true;
  }

  if (
    pathname.startsWith('/docs/') &&
    !pathname.endsWith('.md') &&
    !pathname.endsWith('.txt')
  ) {
    return true;
  }

  return false;
}

/**
 * Keeps non-page route handlers and static files on document navigation
 * while routing App Router pages through the client router.
 */
export const appNavigationPolicy: FastNavigationPolicy = (intent, proposed) => {
  const targetUrl = new URL(proposed.destination, intent.url);

  if (ownsAppRoute(targetUrl)) {
    return { kind: 'router' };
  }

  return {
    kind: 'document',
    method: proposed.method === 'replace' ? 'replace' : 'assign',
  };
};

/** App-configured `FastLink` that starts eligible primary-mouse navigation on `pointerdown`. */
export const FastLink = forwardRef<HTMLAnchorElement, FastLinkProps>(
  function FastLink({ navigationPolicy, ...props }, ref) {
    return (
      <BaseFastLink
        ref={ref}
        navigationPolicy={navigationPolicy ?? appNavigationPolicy}
        {...props}
      />
    );
  },
);

/** Wraps link subtrees (including Fumadocs navigation/sidebar/MDX links) with Fast Link early navigation. */
export function FastLinkRegion({
  navigationPolicy,
  ...props
}: FastLinkRegionProps) {
  return (
    <BaseFastLinkRegion
      navigationPolicy={navigationPolicy ?? appNavigationPolicy}
      {...props}
    />
  );
}
