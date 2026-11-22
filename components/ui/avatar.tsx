'use client';

import { useState, type ComponentProps, type ReactNode } from 'react';
import { User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type AvatarSrc = string | { src: string };
export type AvatarImageRole = 'presentation' | 'none';
export type AvatarTextSize = 'small' | 'large';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #376cff 0%, #2448c5 100%)',
  'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
  'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
  'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #5b21b6 100%)',
] as const;

/** Computes a deterministic non-negative hash for selecting fallback gradients. */
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** Extracts up to two uppercase initials from a fallback label. */
function getInitials(fallbackText: string): string {
  const words = fallbackText.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) {
    return Array.from(words[0])[0]?.toUpperCase() ?? '';
  }
  const first = Array.from(words[0])[0] ?? '';
  const last = Array.from(words[words.length - 1])[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

export interface AvatarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** URL or static-import object of the image to display. */
  src?: AvatarSrc;
  /** Accessible label for the avatar, and source of fallback initials. */
  fallbackText: string;
  /** Show letter initials in the gradient fallback. */
  showInitials?: boolean;
  /** Custom node rendered when the image is missing or fails to load. */
  fallback?: ReactNode;
  /** Alt text for the avatar image. */
  imageAlt?: string;
  /** ARIA role applied to the avatar image. */
  imageRole?: AvatarImageRole;
  /** Size of the avatar in pixels. */
  size?: number;
  /** Show loading skeleton state. */
  isLoading?: boolean;
  /** Size of the fallback text. */
  textSize?: AvatarTextSize;
  /** Load the image eagerly with high fetch priority. */
  imagePriority?: boolean;
}

/** Displays a user or entity image, loading skeleton, custom fallback, or deterministic gradient initials. */
function Avatar({
  className,
  style,
  src,
  fallbackText,
  showInitials = true,
  fallback,
  imageAlt = 'Avatar',
  imageRole,
  size = 40,
  isLoading = false,
  textSize = 'large',
  imagePriority = false,
  ...props
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const rawSrc = typeof src === 'string' ? src : src?.src;
  const resolvedSrc = rawSrc && rawSrc.trim().length > 0 ? rawSrc : undefined;
  const showImage = !isLoading && Boolean(resolvedSrc) && failedSrc !== resolvedSrc;
  const hasSemanticImg = showImage && imageRole !== 'presentation' && imageRole !== 'none';

  const initials = showInitials ? getInitials(fallbackText) : '';
  const fontSize =
    textSize === 'small'
      ? Math.max(9, Math.round(size * 0.3))
      : Math.max(10, Math.round(size * 0.38));
  const gradient = AVATAR_GRADIENTS[hashString(fallbackText) % AVATAR_GRADIENTS.length];

  return (
    <div
      data-slot="avatar"
      role={hasSemanticImg ? undefined : 'img'}
      aria-label={hasSemanticImg ? undefined : fallbackText}
      aria-busy={isLoading || undefined}
      style={{ width: size, height: size, ...style }}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md select-none after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:ring-1 after:ring-inset after:ring-black/8 dark:after:ring-white/12',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Skeleton className="size-full rounded-[inherit]" />
      ) : showImage ? (
        <img
          data-slot="avatar-image"
          src={resolvedSrc}
          alt={imageAlt}
          role={imageRole}
          width={size}
          height={size}
          loading={imagePriority ? 'eager' : 'lazy'}
          fetchPriority={imagePriority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailedSrc(resolvedSrc ?? null)}
          className="size-full object-cover"
        />
      ) : fallback !== undefined ? (
        <div
          data-slot="avatar-fallback"
          className="flex size-full items-center justify-center bg-bg-tertiary text-text-secondary"
        >
          {fallback}
        </div>
      ) : (
        <div
          data-slot="avatar-fallback"
          style={{ backgroundImage: gradient }}
          className="flex size-full items-center justify-center text-text-white"
        >
          {initials ? (
            <span
              aria-hidden="true"
              style={{ fontSize }}
              className="font-medium leading-none tracking-tight select-none"
            >
              {initials}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

export interface UserAvatarProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Accessible label and fallback text. */
  alt: string;
  /** URL or static-import object of the profile image. */
  src?: AvatarSrc;
  /** Size of the avatar in pixels. */
  size?: number;
}

/** Round person avatar defaulting to 20px with a user icon fallback when no image is present. */
function UserAvatar({ alt, src, size = 20, className, ...props }: UserAvatarProps) {
  return (
    <Avatar
      src={src}
      fallbackText={alt}
      imageAlt={alt}
      size={size}
      className={cn('rounded-full', className)}
      fallback={<User aria-hidden="true" className="size-[60%] text-text-secondary" />}
      {...props}
    />
  );
}

export { Avatar, UserAvatar };
