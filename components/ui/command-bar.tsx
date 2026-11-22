'use client';

import {
  createContext,
  useContext,
  type ComponentProps,
  type ComponentPropsWithoutRef,
} from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const CommandBarContext = createContext(false);

export interface CommandRootProps extends ComponentProps<typeof CommandPrimitive> {
  /** Uses larger input, item, and group spacing for a command bar inside a Dialog. */
  inDialog?: boolean;
}

/** Root container for the searchable command menu backed by `cmdk`. */
function CommandRoot({
  inDialog = false,
  shouldFilter = true,
  loop = false,
  className,
  ...props
}: CommandRootProps) {
  return (
    <CommandBarContext.Provider value={inDialog}>
      <CommandPrimitive
        data-slot="command-bar"
        data-in-dialog={inDialog ? '' : undefined}
        shouldFilter={shouldFilter}
        loop={loop}
        className={cn(
          'flex w-full flex-col overflow-hidden bg-bg-primary text-text-primary outline-none',
          className,
        )}
        {...props}
      />
    </CommandBarContext.Provider>
  );
}

export interface CommandInputProps extends ComponentProps<typeof CommandPrimitive.Input> {
  /** Additional classes for the row holding the search icon and input. */
  wrapperClassName?: string;
}

/** Search input row for filtering command items. */
function CommandInput({ className, wrapperClassName, ...props }: CommandInputProps) {
  const inDialog = useContext(CommandBarContext);

  return (
    <div
      data-slot="command-bar-input-wrapper"
      className={cn(
        'flex items-center border-b border-border-gray',
        inDialog ? 'gap-2.5 px-4 py-3.5' : 'gap-2 px-3 py-2.5',
        wrapperClassName,
      )}
    >
      <Search aria-hidden="true" className="size-4 shrink-0 text-text-tertiary" />
      <CommandPrimitive.Input
        data-slot="command-bar-input"
        className={cn(
          'min-w-0 flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary outline-none disabled:cursor-not-allowed disabled:opacity-50',
          inDialog ? 'text-body-regular' : 'text-body-small-regular',
          className,
        )}
        {...props}
      />
    </div>
  );
}

export type CommandListProps = ComponentPropsWithoutRef<typeof CommandPrimitive.List>;

/** Scrollable container for groups, items, and separators, capped at 300px tall. */
function CommandList({ className, ...props }: CommandListProps) {
  const inDialog = useContext(CommandBarContext);

  return (
    <CommandPrimitive.List
      data-slot="command-bar-list"
      className={cn(
        'scrollbar-custom max-h-[300px] overflow-x-hidden overflow-y-auto overscroll-contain',
        inDialog ? 'p-2' : 'p-1.5',
        className,
      )}
      {...props}
    />
  );
}

export type CommandEmptyProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

/** Displayed when search matches no command items. */
function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  const inDialog = useContext(CommandBarContext);

  return (
    <CommandPrimitive.Empty
      data-slot="command-bar-empty"
      className={cn(
        'text-center text-body-small-regular text-text-tertiary',
        inDialog ? 'py-8' : 'py-6',
        className,
      )}
      {...props}
    />
  );
}

export type CommandGroupProps = ComponentProps<typeof CommandPrimitive.Group>;

/** Groups command items under a heading. */
function CommandGroup({ forceMount = false, className, ...props }: CommandGroupProps) {
  const inDialog = useContext(CommandBarContext);

  return (
    <CommandPrimitive.Group
      data-slot="command-bar-group"
      forceMount={forceMount}
      className={cn(
        'overflow-hidden [&_[cmdk-group-heading]]:text-body-mini-medium [&_[cmdk-group-heading]]:text-text-tertiary',
        inDialog
          ? '[&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-2'
          : '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5',
        className,
      )}
      {...props}
    />
  );
}

export type CommandItemProps = ComponentProps<typeof CommandPrimitive.Item>;

/** Actionable item inside `Command.List` triggered by click or Enter. */
function CommandItem({
  disabled = false,
  forceMount = false,
  className,
  ...props
}: CommandItemProps) {
  const inDialog = useContext(CommandBarContext);

  return (
    <CommandPrimitive.Item
      data-slot="command-bar-item"
      disabled={disabled}
      forceMount={forceMount}
      className={cn(
        'relative flex cursor-pointer items-center rounded-md text-text-primary select-none outline-none data-[selected=true]:bg-control-hover data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-text-secondary data-[selected=true]:[&_svg]:text-text-primary',
        inDialog ? 'min-h-9 gap-2.5 px-2.5 py-2 text-body-regular' : 'min-h-8 gap-2 px-2 py-1.5 text-body-small-regular',
        className,
      )}
      {...props}
    />
  );
}

export type CommandSeparatorProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;

/** Hairline divider between command groups. */
function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
  const inDialog = useContext(CommandBarContext);

  return (
    <CommandPrimitive.Separator
      data-slot="command-bar-separator"
      className={cn('h-px w-full shrink-0 bg-border-gray', inDialog ? 'my-2' : 'my-1.5', className)}
      {...props}
    />
  );
}

export const Command = {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Item: CommandItem,
  Separator: CommandSeparator,
};

export {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandRoot,
  CommandSeparator,
};
