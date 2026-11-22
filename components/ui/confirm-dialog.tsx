'use client';

import type { ReactNode, Ref } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Button, type ButtonMode } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConfirmDialogVariant = 'default' | 'destructive';
export type ConfirmDialogSize = 'md' | 'lg' | 'xl';
export type ConfirmDialogOverlayZIndex = 'dialog' | 'drawer';

const SIZE_CLASSES: Record<ConfirmDialogSize, string> = {
  md: 'w-[440px]',
  lg: 'w-[640px] min-h-[400px]',
  xl: 'w-[800px] min-h-[520px]',
};

export interface ConfirmDialogProps {
  /** Whether the dialog is open. */
  open: boolean;
  /** Called when Cancel, the close button, Escape, or a click outside closes the dialog. */
  onOpenChange: (open: boolean) => void;
  /** Dialog title. */
  title: ReactNode;
  /** Explains what confirming does. Announced as the dialog's description. */
  description: ReactNode;
  /** Called when the confirm button is clicked. Does not close the dialog automatically. */
  onConfirm: () => void;
  /** Label of the confirm button. */
  confirmText?: string;
  /** Label of the cancel button. */
  cancelText?: string;
  /** Accessible label of the close button. */
  closeText?: string;
  /** Use `destructive` for actions that cannot be undone. */
  variant?: ConfirmDialogVariant;
  /** Shows a spinner on the confirm button and disables every button. */
  isLoading?: boolean;
  /** Disables the confirm button. */
  confirmDisabled?: boolean;
  /** Icon rendered before the title. */
  titleIcon?: ReactNode;
  /** Body content between dividers, such as acknowledgements or form fields. */
  children?: ReactNode;
  /** Id of a form. The confirm button submits it instead of calling `onConfirm`. */
  form?: string;
  /** Overrides the confirm button style. Defaults to `primary`, or `destructive` with `variant="destructive"`. */
  confirmMode?: ButtonMode;
  /** Style of the cancel button. */
  cancelMode?: ButtonMode;
  /** Classes for the confirm button. */
  confirmClassName?: string;
  /** Ref to the cancel button, for example to focus it when the dialog opens. */
  cancelButtonRef?: Ref<HTMLButtonElement>;
  /** Called when the dialog opens. Nothing is focused automatically, so focus the initial element here. */
  onOpenAutoFocus?: (event: Event) => void;
  /** Called when focus returns after the dialog closes. */
  onCloseAutoFocus?: (event: Event) => void;
  /** Panel width (`440`, `640`, or `800` pixels). `lg` and `xl` also set a minimum height. */
  size?: ConfirmDialogSize;
  /** Classes for the dialog panel. */
  contentClassName?: string;
  /** Stacking layer. Use `drawer` to show the dialog above a drawer. */
  overlayZIndex?: ConfirmDialogOverlayZIndex;
}

/** Controlled confirmation prompt built on Radix Dialog with structured header, optional body, and action footer. */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  closeText = 'Close dialog',
  variant = 'default',
  isLoading = false,
  confirmDisabled = false,
  titleIcon,
  children,
  form,
  confirmMode,
  cancelMode = 'secondary',
  confirmClassName,
  cancelButtonRef,
  onOpenAutoFocus,
  onCloseAutoFocus,
  size = 'md',
  contentClassName,
  overlayZIndex = 'dialog',
}: ConfirmDialogProps) {
  const resolvedConfirmMode: ButtonMode =
    confirmMode ?? (variant === 'destructive' ? 'destructive' : 'primary');
  const zIndexClass = overlayZIndex === 'drawer' ? 'z-[60]' : 'z-50';
  const hasBody = children !== undefined && children !== null && children !== false;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-slot="confirm-dialog-overlay"
          className={cn(
            'fixed inset-0 bg-black/25 backdrop-blur-[2px] ease-out data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0 data-[state=closed]:fill-mode-forwards',
            zIndexClass,
          )}
        />
        <DialogPrimitive.Content
          data-slot="confirm-dialog-content"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            onOpenAutoFocus?.(event);
          }}
          onCloseAutoFocus={onCloseAutoFocus}
          className={cn(
            'fixed top-1/2 left-1/2 flex max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 origin-center flex-col overflow-hidden rounded-[16px] bg-bg-primary text-text-primary shadow-high ease-out outline-none data-[state=open]:animate-in data-[state=open]:duration-250 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98] data-[state=closed]:animate-out data-[state=closed]:duration-180 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.98] data-[state=closed]:fill-mode-forwards motion-reduce:data-[state=open]:zoom-in-100 motion-reduce:data-[state=closed]:zoom-out-100',
            zIndexClass,
            SIZE_CLASSES[size],
            contentClassName,
          )}
        >
          <div data-slot="confirm-dialog-header" className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                {titleIcon ? (
                  <span className="inline-flex shrink-0 items-center">{titleIcon}</span>
                ) : null}
                <DialogPrimitive.Title className="text-title-mini-semibold text-text-primary">
                  {title}
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close asChild>
                <Button
                  mode="ghost"
                  size="small"
                  iconStart="x"
                  aria-label={closeText}
                  disabled={isLoading}
                  className="-mt-1 -mr-1.5 shrink-0"
                />
              </DialogPrimitive.Close>
            </div>
            <DialogPrimitive.Description className="mt-1.5 text-body-small-regular text-text-secondary">
              {description}
            </DialogPrimitive.Description>
          </div>

          {hasBody ? (
            <div
              data-slot="confirm-dialog-body"
              className="flex-1 border-t border-border-gray px-5 py-4"
            >
              {children}
            </div>
          ) : null}

          <div
            data-slot="confirm-dialog-footer"
            className="mt-auto flex items-center justify-end gap-2 border-t border-border-gray px-5 py-3.5"
          >
            <Button
              ref={cancelButtonRef}
              mode={cancelMode}
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              {cancelText}
            </Button>
            <Button
              mode={resolvedConfirmMode}
              type={form ? 'submit' : 'button'}
              form={form}
              disabled={confirmDisabled || isLoading}
              loading={{ isLoading }}
              onClick={form ? undefined : onConfirm}
              className={confirmClassName}
            >
              {confirmText}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { ConfirmDialog };
