import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { FastLinkRegion } from '@/components/fast-link';
import { DrawerProvider } from '@/components/ui/drawer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { appName, siteUrl } from '@/lib/shared';
import './global.css';
import { cn } from '@/lib/utils';

const geistRounded = localFont({
  src: './fonts/GeistRounded.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-geist-rounded',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: `${appName} documentation`,
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(geistRounded.className, geistRounded.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <TooltipProvider delayDuration={300} skipDelayDuration={300}>
            <FastLinkRegion>{children}</FastLinkRegion>
            <DrawerProvider />
          </TooltipProvider>
        </RootProvider>
      </body>
    </html>
  );
}
