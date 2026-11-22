'use client';

import { useState } from 'react';
import { Archive, Copy, Ellipsis, Pencil, Star } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbAccessory,
  BreadcrumbItem,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

/** Demonstrates grouping a crumb and inline accessory actions in a Fragment without a chevron between them. */
export function BreadcrumbAccessories() {
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteLabel = isFavorite ? 'Remove from favorites' : 'Add to favorites';

  return (
    <Breadcrumb className="flex-initial">
      <BreadcrumbItem href="#projects" label="Projects" />
      <>
        <BreadcrumbItem label="Q4 visibility push" />
        <BreadcrumbAccessory>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={favoriteLabel}
                aria-pressed={isFavorite}
                variant="ghost"
                size="small"
                className="size-7 px-0"
                onClick={() => setIsFavorite((current) => !current)}
              >
                <Star
                  className={
                    isFavorite ? 'size-4 fill-fill-amber text-fill-amber' : 'size-4 text-fill-secondary'
                  }
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={6}>{favoriteLabel}</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Project actions"
                variant="ghost"
                size="small"
                className="size-7 px-0"
              >
                <Ellipsis className="size-4 text-fill-secondary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Pencil />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbAccessory>
      </>
    </Breadcrumb>
  );
}
