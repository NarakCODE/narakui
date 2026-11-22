'use client';

import type { ComponentProps, ReactNode } from 'react';
import { Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Section title. */
  title: string;
  /** Supporting text below the title. */
  subtitle?: string;
  /** Actions aligned to the right. */
  children?: ReactNode;
  /** Content shown next to the title (e.g., a Badge). */
  badge?: ReactNode;
  /** Shows an info icon with this tooltip next to the title. */
  tooltipContent?: ReactNode;
  /** Underlines the title and shows this tooltip on hover/focus. */
  titleTooltip?: ReactNode;
  /** Replaces the title with a skeleton. */
  isTitleLoading?: boolean;
  /** Replaces the subtitle with a skeleton. Has no effect without a `subtitle`. */
  isSubtitleLoading?: boolean;
  /** Anchor id for linking to the section. */
  id?: string;
  /** Additional classes for the actions wrapper. */
  childrenClassName?: string;
  /** Additional classes for the subtitle. */
  subtitleClassName?: string;
  /** Additional classes for the info icon shown by `tooltipContent`. */
  tooltipIconClassName?: string;
}

/** Title, optional badge/tooltip, subtitle, and right-aligned actions row for a page section. */
function SectionHeader({
  title,
  subtitle,
  children,
  badge,
  tooltipContent,
  titleTooltip,
  isTitleLoading = false,
  isSubtitleLoading = false,
  id,
  className,
  childrenClassName,
  subtitleClassName,
  tooltipIconClassName,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      id={id}
      className={cn('flex scroll-mt-50 items-start justify-between', className)}
      {...props}
    >
      <div className="space-y-1">
        {isTitleLoading ? (
          <Skeleton width="180px" height="24px" />
        ) : (
          <div className="flex items-center gap-1.5">
            {titleTooltip ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <h2
                    tabIndex={0}
                    className="cursor-help text-title-mini-semibold text-text-primary underline decoration-fill-tertiary decoration-dashed underline-offset-4 focus-visible:rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {title}
                  </h2>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  {titleTooltip}
                </TooltipContent>
              </Tooltip>
            ) : (
              <h2 className="text-title-mini-semibold text-text-primary">{title}</h2>
            )}
            {badge}
            {tooltipContent ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={`More info about ${title}`}
                    className="-m-1.5 flex cursor-help items-center justify-center rounded-sm p-1.5 text-fill-secondary transition-[transform,color] duration-150 ease-out hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 motion-reduce:[@media(hover:hover)_and_(pointer:fine)]:hover:scale-100"
                  >
                    <Info
                      aria-hidden="true"
                      className={cn('size-4 shrink-0', tooltipIconClassName)}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  {tooltipContent}
                </TooltipContent>
              </Tooltip>
            ) : null}
          </div>
        )}
        {subtitle ? (
          isSubtitleLoading ? (
            <Skeleton width="240px" height="20px" />
          ) : (
            <div className={cn('text-body-regular text-text-secondary', subtitleClassName)}>
              {subtitle}
            </div>
          )
        ) : null}
      </div>
      {children ? (
        <div
          data-slot="section-header-actions"
          className={cn('mt-auto flex items-center gap-3', childrenClassName)}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export interface SectionProps extends ComponentProps<'div'> {
  /** Section content. */
  children: ReactNode;
  /** Adds vertical spacing (`space-y-6`) between direct children. */
  spacing?: boolean;
}

/** Page section wrapper providing consistent vertical spacing between header and content. */
function Section({ children, spacing = true, className, ...props }: SectionProps) {
  return (
    <div data-slot="section" className={cn(spacing && 'space-y-6', className)} {...props}>
      {children}
    </div>
  );
}

export { Section, SectionHeader };
