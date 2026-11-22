'use client';

import { useState, type ReactNode } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link2,
  MessageSquare,
  Underline,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toolbar } from '@/components/ui/toolbar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function ToolbarIconButton({
  label,
  icon,
  pressed,
  disabled,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  pressed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toolbar.Item disabled={disabled}>
          <Button
            aria-label={label}
            aria-pressed={pressed}
            className="aria-pressed:bg-control-selected aria-pressed:text-text-primary"
            iconStart={icon}
            mode="ghost"
            size="small"
            onClick={onClick}
          />
        </Toolbar.Item>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>{label}</TooltipContent>
    </Tooltip>
  );
}

type Alignment = 'left' | 'center' | 'right';

export function ToolbarFormatting() {
  const [marks, setMarks] = useState({
    bold: true,
    italic: false,
    underline: false,
  });
  const [alignment, setAlignment] = useState<Alignment>('left');
  const toggle = (mark: keyof typeof marks) =>
    setMarks((current) => ({ ...current, [mark]: !current[mark] }));

  return (
    <TooltipProvider delayDuration={300}>
      <Toolbar.Root
        aria-label="Text formatting"
        className="rounded-lg bg-bg-primary p-1 shadow-medium"
      >
        <ToolbarIconButton
          label="Bold"
          icon={<Bold aria-hidden="true" />}
          pressed={marks.bold}
          onClick={() => toggle('bold')}
        />
        <ToolbarIconButton
          label="Italic"
          icon={<Italic aria-hidden="true" />}
          pressed={marks.italic}
          onClick={() => toggle('italic')}
        />
        <ToolbarIconButton
          label="Underline"
          icon={<Underline aria-hidden="true" />}
          pressed={marks.underline}
          onClick={() => toggle('underline')}
        />
        <Toolbar.Separator />
        <ToolbarIconButton
          label="Align left"
          icon={<AlignLeft aria-hidden="true" />}
          pressed={alignment === 'left'}
          onClick={() => setAlignment('left')}
        />
        <ToolbarIconButton
          label="Align center"
          icon={<AlignCenter aria-hidden="true" />}
          pressed={alignment === 'center'}
          onClick={() => setAlignment('center')}
        />
        <ToolbarIconButton
          label="Align right"
          icon={<AlignRight aria-hidden="true" />}
          pressed={alignment === 'right'}
          onClick={() => setAlignment('right')}
        />
        <Toolbar.Separator />
        <ToolbarIconButton
          label="Add link"
          icon={<Link2 aria-hidden="true" />}
        />
        <ToolbarIconButton
          label="Add comment"
          icon={<MessageSquare aria-hidden="true" />}
          disabled
        />
      </Toolbar.Root>
    </TooltipProvider>
  );
}
