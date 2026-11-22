'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type DragEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { ChevronRight, Minus, Plus } from 'lucide-react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Headless-tree compatible types & self-contained useTree engine             */
/* -------------------------------------------------------------------------- */

export interface FeatureImplementation {
  key: string;
}

export const syncDataLoaderFeature: FeatureImplementation = {
  key: 'syncDataLoader',
};

export const hotkeysCoreFeature: FeatureImplementation = {
  key: 'hotkeysCore',
};

export const dragAndDropFeature: FeatureImplementation = {
  key: 'dragAndDrop',
};

export interface TreeItemMeta {
  itemId: string;
  parentId: string | null;
  level: number;
  index: number;
  posInSet: number;
  setSize: number;
}

export interface ItemInstance<T = unknown> {
  getId: () => string;
  getItemData: () => T;
  getItemName: () => string;
  isFolder: () => boolean;
  isExpanded: () => boolean;
  expand: () => void;
  collapse: () => void;
  getChildren: () => ItemInstance<T>[];
  getParent: () => ItemInstance<T> | undefined;
  getItemMeta: () => TreeItemMeta;
  isFocused: () => boolean;
  isSelected: () => boolean;
  isDragTarget: () => boolean;
  isDraggingOver: () => boolean;
  setFocused: () => void;
  getProps: () => HTMLAttributes<HTMLElement> & {
    ref?: (node: HTMLElement | null) => void;
  };
}

export interface TreeDragTarget<T = unknown> {
  item: ItemInstance<T>;
  position: 'before' | 'inside' | 'after';
}

export interface TreeInstance<T = unknown> {
  getItems: () => ItemInstance<T>[];
  getItemInstance: (itemId: string) => ItemInstance<T> | undefined;
  getContainerProps: (
    treeLabel?: string,
  ) => HTMLAttributes<HTMLElement> & { style?: CSSProperties };
  getDragLineStyle?: (
    topOffset?: number,
    leftOffset?: number,
  ) => CSSProperties;
  hasFeature?: (feature: FeatureImplementation) => boolean;
  getRootItemId?: () => string;
}

export interface UseTreeConfig<T> {
  rootItemId: string;
  getItemName: (item: { getId: () => string; getItemData: () => T }) => string;
  isItemFolder: (item: { getId: () => string; getItemData: () => T }) => boolean;
  dataLoader: {
    getItem: (itemId: string) => T;
    getChildren: (itemId: string) => string[];
  };
  features?: readonly FeatureImplementation[];
  initialState?: {
    expandedItems?: string[];
    focusedItem?: string | null;
    selectedItems?: string[];
  };
  onDrop?: (
    items: ItemInstance<T>[],
    target: TreeDragTarget<T>,
  ) => void;
}

interface DragLineState {
  visible: boolean;
  top: number;
  left: number;
  width: number;
}

/**
 * Self-contained headless-tree compatible hook supporting sync data loading,
 * keyboard navigation, expansion state, and drag-and-drop drop-line tracking.
 */
function useTree<T>(config: UseTreeConfig<T>): TreeInstance<T> {
  const {
    rootItemId,
    getItemName,
    isItemFolder,
    dataLoader,
    features = [],
    initialState,
    onDrop,
  } = config;

  const hasDnd = features.some((f) => f.key === dragAndDropFeature.key);

  const [expandedIds, setExpandedIds] = useState<string[]>(
    () => initialState?.expandedItems ?? [rootItemId],
  );
  const [focusedId, setFocusedId] = useState<string | null>(
    () => initialState?.focusedItem ?? null,
  );
  const [selectedIds] = useState<string[]>(
    () => initialState?.selectedItems ?? [],
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<{
    itemId: string;
    position: 'before' | 'inside' | 'after';
  } | null>(null);
  const [dragLine, setDragLine] = useState<DragLineState>({
    visible: false,
    top: 0,
    left: 0,
    width: 0,
  });

  const itemElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const expandedSet = useMemo(() => new Set(expandedIds), [expandedIds]);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const expandItem = useCallback((id: string) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const collapseItem = useCallback((id: string) => {
    setExpandedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const clearDrag = useCallback(() => {
    setDraggedId(null);
    setDragTarget(null);
    setDragLine({ visible: false, top: 0, left: 0, width: 0 });
  }, []);

  const treeModel = useMemo(() => {
    const instances = new Map<string, ItemInstance<T>>();
    const flatList: ItemInstance<T>[] = [];
    const childrenMap = new Map<string, string[]>();
    const parentMap = new Map<string, string | null>();
    const metaMap = new Map<string, TreeItemMeta>();

    const walk = (
      id: string,
      parentId: string | null,
      level: number,
      posInSet: number,
      setSize: number,
    ) => {
      const data = dataLoader.getItem(id);
      const childIds = dataLoader.getChildren(id) ?? [];
      childrenMap.set(id, childIds);
      parentMap.set(id, parentId);

      const index = flatList.length;
      metaMap.set(id, {
        itemId: id,
        parentId,
        level,
        index,
        posInSet,
        setSize,
      });

      const miniHandle = {
        getId: () => id,
        getItemData: () => data,
      };
      const folder = isItemFolder(miniHandle);
      const name = getItemName(miniHandle);

      const instance: ItemInstance<T> = {
        getId: () => id,
        getItemData: () => data,
        getItemName: () => name,
        isFolder: () => folder,
        isExpanded: () => expandedSet.has(id),
        expand: () => expandItem(id),
        collapse: () => collapseItem(id),
        getChildren: () =>
          (childrenMap.get(id) ?? [])
            .map((cid) => instances.get(cid))
            .filter((x): x is ItemInstance<T> => Boolean(x)),
        getParent: () => {
          const pid = parentMap.get(id);
          return pid ? instances.get(pid) : undefined;
        },
        getItemMeta: () =>
          metaMap.get(id) ?? {
            itemId: id,
            parentId,
            level,
            index,
            posInSet,
            setSize,
          },
        isFocused: () => focusedId === id,
        isSelected: () => selectedSet.has(id),
        isDragTarget: () =>
          dragTarget?.itemId === id && dragTarget.position === 'inside',
        isDraggingOver: () => dragTarget?.itemId === id,
        setFocused: () => {
          setFocusedId(id);
          itemElementsRef.current.get(id)?.focus();
        },
        getProps: () => {
          const props: HTMLAttributes<HTMLElement> & {
            ref?: (node: HTMLElement | null) => void;
          } = {
            ref: (node) => {
              if (node) {
                itemElementsRef.current.set(id, node);
              } else {
                itemElementsRef.current.delete(id);
              }
            },
            onFocus: () => {
              setFocusedId(id);
            },
            onClick: () => {
              setFocusedId(id);
              if (folder && childIds.length > 0) {
                if (expandedSet.has(id)) {
                  collapseItem(id);
                } else {
                  expandItem(id);
                }
              }
            },
          };

          if (hasDnd) {
            props.draggable = true;
            props.onDragStart = (event: DragEvent<HTMLElement>) => {
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', id);
              setDraggedId(id);
            };
            props.onDragOver = (event: DragEvent<HTMLElement>) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
              if (draggedId === id) {
                setDragLine((prev) =>
                  prev.visible ? { ...prev, visible: false } : prev,
                );
                return;
              }
              const rowEl = event.currentTarget;
              const rect = rowEl.getBoundingClientRect();
              const ratio = (event.clientY - rect.top) / Math.max(rect.height, 1);

              const indentPx = parseFloat(
                getComputedStyle(rowEl).paddingLeft || '0',
              );

              if (folder && ratio > 0.28 && ratio < 0.72) {
                setDragTarget({ itemId: id, position: 'inside' });
                setDragLine({ visible: false, top: 0, left: 0, width: 0 });
              } else if (ratio <= 0.5) {
                setDragTarget({ itemId: id, position: 'before' });
                setDragLine({
                  visible: true,
                  top: rowEl.offsetTop,
                  left: indentPx,
                  width: Math.max(rowEl.offsetWidth - indentPx, 0),
                });
              } else {
                setDragTarget({ itemId: id, position: 'after' });
                setDragLine({
                  visible: true,
                  top: rowEl.offsetTop + rowEl.offsetHeight,
                  left: indentPx,
                  width: Math.max(rowEl.offsetWidth - indentPx, 0),
                });
              }
            };
            props.onDrop = (event: DragEvent<HTMLElement>) => {
              event.preventDefault();
              const sourceId =
                draggedId ?? event.dataTransfer.getData('text/plain');
              const sourceInst = sourceId ? instances.get(sourceId) : undefined;
              const position = dragTarget?.position ?? 'after';
              if (sourceInst && sourceId !== id) {
                onDrop?.([sourceInst], { item: instance, position });
              }
              clearDrag();
            };
            props.onDragEnd = () => {
              clearDrag();
            };
          }

          return props;
        },
      };

      instances.set(id, instance);
      flatList.push(instance);

      const isRoot = id === rootItemId;
      if ((isRoot || expandedSet.has(id)) && childIds.length > 0) {
        const nextLevel = isRoot ? 0 : level + 1;
        childIds.forEach((cid, idx) => {
          walk(cid, id, nextLevel, idx + 1, childIds.length);
        });
      }
    };

    walk(rootItemId, null, -1, 1, 1);

    return { instances, flatList };
  }, [
    rootItemId,
    dataLoader,
    isItemFolder,
    getItemName,
    expandedSet,
    selectedSet,
    focusedId,
    draggedId,
    dragTarget,
    hasDnd,
    expandItem,
    collapseItem,
    clearDrag,
    onDrop,
  ]);

  return useMemo<TreeInstance<T>>(
    () => ({
      getItems: () => treeModel.flatList,
      getItemInstance: (id: string) => treeModel.instances.get(id),
      getRootItemId: () => rootItemId,
      hasFeature: (feature: FeatureImplementation) =>
        features.some((f) => f.key === feature.key),
      getContainerProps: (treeLabel?: string) => ({
        role: 'tree',
        'aria-label': treeLabel,
        style: hasDnd ? { position: 'relative' } : undefined,
        onDragLeave: hasDnd
          ? (event: DragEvent<HTMLElement>) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setDragTarget(null);
                setDragLine((prev) =>
                  prev.visible ? { ...prev, visible: false } : prev,
                );
              }
            }
          : undefined,
      }),
      getDragLineStyle: hasDnd
        ? (topOffset = 0, leftOffset = 0): CSSProperties => {
            if (!dragLine.visible) {
              return { display: 'none' };
            }
            return {
              top: `${dragLine.top + topOffset}px`,
              left: `${dragLine.left + leftOffset}px`,
              width: `${dragLine.width}px`,
            };
          }
        : undefined,
    }),
    [treeModel, rootItemId, features, hasDnd, dragLine],
  );
}

/* -------------------------------------------------------------------------- */
/* Tree UI Primitives                                                         */
/* -------------------------------------------------------------------------- */

export type TreeToggleIconType = 'chevron' | 'plus-minus';

interface TreeContextValue<T = unknown> {
  tree: TreeInstance<T>;
  indent: number;
  showLines: boolean;
  toggleIconType: TreeToggleIconType;
  firstFocusableId: string | null;
}

const TreeContext = createContext<TreeContextValue<unknown> | null>(null);

interface TreeItemContextValue<T = unknown> {
  item: ItemInstance<T>;
  disabled: boolean;
  onToggleExpand?: (item: ItemInstance<T>) => void;
}

const TreeItemContext = createContext<TreeItemContextValue<unknown> | null>(null);

export interface TreeProps<T = unknown> extends ComponentProps<'div'> {
  /** The headless-tree instance returned by `useTree`. */
  tree: TreeInstance<T>;
  /** Width of each nesting level in pixels. @default 16 */
  indent?: number;
  /** Positions rows relatively so a consumer can draw guide lines. It draws no lines itself. @default false */
  showLines?: boolean;
  /** Icon used by the folder toggle in `TreeItemLabel`. @default 'chevron' */
  toggleIconType?: TreeToggleIconType;
  /** Accessible label for the tree. */
  'aria-label'?: string;
  /** Render the child element instead of a `div`. @default false */
  asChild?: boolean;
}

/** Hierarchical tree container managing shared indent, toggle style, and keyboard navigation. */
function Tree<T = unknown>({
  tree,
  indent = 16,
  showLines = false,
  toggleIconType = 'chevron',
  'aria-label': ariaLabel,
  asChild = false,
  className,
  style,
  children,
  ...props
}: TreeProps<T>) {
  const containerProps = tree.getContainerProps(ariaLabel);
  const rootId = tree.getRootItemId?.();
  const visibleItems = tree
    .getItems()
    .filter((item) => item.getId() !== rootId);
  const focusedVisible = visibleItems.find((item) => item.isFocused());
  const firstFocusableId =
    focusedVisible?.getId() ?? visibleItems[0]?.getId() ?? null;

  const Comp = asChild ? Slot.Root : 'div';

  const mergedStyle: CSSProperties = {
    ...containerProps.style,
    '--tree-indent': `${indent}px`,
    ...style,
  } as CSSProperties;

  return (
    <TreeContext.Provider
      value={{
        tree: tree as TreeInstance<unknown>,
        indent,
        showLines,
        toggleIconType,
        firstFocusableId,
      }}
    >
      <Comp
        {...containerProps}
        {...props}
        aria-label={ariaLabel ?? containerProps['aria-label']}
        data-slot="tree"
        style={mergedStyle}
        className={cn('flex flex-col', className)}
      >
        {children}
      </Comp>
    </TreeContext.Provider>
  );
}

export interface TreeItemProps<T = unknown>
  extends Omit<ComponentProps<'div'>, 'onClick'> {
  /** The headless-tree item to render. */
  item: ItemInstance<T>;
  /** Row content, usually a `TreeItemLabel`. */
  children: ReactNode;
  /** Blocks clicks and keyboard actions and removes the row from the tab order. @default false */
  disabled?: boolean;
  /** Replaces the default expand and collapse for the toggle button and the left and right arrow keys. */
  onToggleExpand?: (item: ItemInstance<T>) => void;
  /** Runs before the headless-tree click handler. Call `preventDefault()` to skip it. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Render the child element instead of a `div`. @default false */
  asChild?: boolean;
}

/** Single row inside a `Tree` with nesting indentation, keyboard controls, and drag states. */
function TreeItem<T = unknown>({
  item,
  children,
  disabled = false,
  onToggleExpand,
  onClick,
  onKeyDown,
  asChild = false,
  className,
  style,
  ...props
}: TreeItemProps<T>) {
  const treeCtx = useContext(TreeContext);
  const itemProps = item.getProps();
  const meta = item.getItemMeta();
  const depth = Math.max(meta.level, 0);
  const isFolder = item.isFolder();
  const isExpanded = isFolder && item.isExpanded();
  const isDragTarget = item.isDragTarget();
  const isFocused = item.isFocused();
  const isSelected = item.isSelected();

  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (onToggleExpand) {
      onToggleExpand(item);
      return;
    }
    if (item.isExpanded()) {
      item.collapse();
    } else {
      item.expand();
    }
  }, [disabled, item, onToggleExpand]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (event.defaultPrevented) return;
    itemProps.onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const treeEl = event.currentTarget.closest('[data-slot="tree"]');
    if (!treeEl) return;

    const rows = Array.from(
      treeEl.querySelectorAll<HTMLElement>(
        '[data-slot="tree-item"]:not([data-disabled="true"])',
      ),
    );
    const currentIndex = rows.indexOf(event.currentTarget);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      rows[Math.min(currentIndex + 1, rows.length - 1)]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      rows[Math.max(currentIndex - 1, 0)]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      rows[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      rows[rows.length - 1]?.focus();
    } else if (event.key === 'ArrowRight') {
      if (isFolder) {
        event.preventDefault();
        if (!isExpanded) {
          handleToggle();
        } else if (currentIndex + 1 < rows.length) {
          rows[currentIndex + 1]?.focus();
        }
      }
    } else if (event.key === 'ArrowLeft') {
      if (isFolder && isExpanded) {
        event.preventDefault();
        handleToggle();
      } else {
        const parent = item.getParent();
        if (parent && parent.getId() !== treeCtx?.tree.getRootItemId?.()) {
          event.preventDefault();
          parent.setFocused();
        }
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const tabIndex = disabled
    ? -1
    : isFocused || treeCtx?.firstFocusableId === item.getId()
      ? 0
      : -1;

  const Comp = asChild ? Slot.Root : 'div';
  const mergedStyle: CSSProperties = {
    paddingLeft: `calc(var(--tree-indent, 16px) * ${depth})`,
    ...style,
  };

  return (
    <TreeItemContext.Provider
      value={{
        item: item as ItemInstance<unknown>,
        disabled,
        onToggleExpand: onToggleExpand as
          | ((item: ItemInstance<unknown>) => void)
          | undefined,
      }}
    >
      <Comp
        {...itemProps}
        {...props}
        role="treeitem"
        tabIndex={tabIndex}
        aria-level={depth + 1}
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-disabled={disabled || undefined}
        data-slot="tree-item"
        data-folder={isFolder ? 'true' : undefined}
        data-expanded={isExpanded ? 'true' : undefined}
        data-focused={isFocused ? 'true' : undefined}
        data-selected={isSelected ? 'true' : undefined}
        data-drag-target={isDragTarget ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={mergedStyle}
        className={cn(
          'group/tree-item select-none rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring',
          treeCtx?.showLines && 'relative',
          disabled && 'pointer-events-none opacity-45',
          isDragTarget && 'bg-control-selected ring-1 ring-blue-base ring-inset',
          className,
        )}
      >
        {children}
      </Comp>
    </TreeItemContext.Provider>
  );
}

export interface TreeItemLabelProps<T = unknown>
  extends Omit<ComponentProps<'span'>, 'children'> {
  /** The item to label. Defaults to the item of the surrounding `TreeItem`. */
  item?: ItemInstance<T>;
  /** Label content. Defaults to `item.getItemName()`. */
  children?: ReactNode;
  /** Replaces the default expand and collapse when the folder toggle is clicked. */
  onToggleClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Render the child element instead of a `span`. @default false */
  asChild?: boolean;
}

/** Row label displaying a folder expand/collapse toggle (or aligned spacer for leaves) and item content. */
function TreeItemLabel<T = unknown>({
  item: itemProp,
  children,
  onToggleClick,
  asChild = false,
  className,
  ...props
}: TreeItemLabelProps<T>) {
  const treeCtx = useContext(TreeContext);
  const itemCtx = useContext(TreeItemContext);
  const item = (itemProp ?? itemCtx?.item) as ItemInstance<T> | undefined;
  const disabled = itemCtx?.disabled ?? false;
  const toggleIconType = treeCtx?.toggleIconType ?? 'chevron';

  const isFolder = item?.isFolder() ?? false;
  const isExpanded = Boolean(item && isFolder && item.isExpanded());
  const hasChildren = Boolean(
    item &&
      isFolder &&
      (item.getChildren().length > 0 || !item.isExpanded()),
  );

  const handleToggleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (disabled || !item) return;

    if (onToggleClick) {
      onToggleClick(event);
      return;
    }

    if (itemCtx?.onToggleExpand) {
      itemCtx.onToggleExpand(item as ItemInstance<unknown>);
      return;
    }

    if (item.isExpanded()) {
      item.collapse();
    } else {
      item.expand();
    }
  };

  const toggleControl =
    isFolder && hasChildren ? (
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        aria-label={isExpanded ? 'Collapse folder' : 'Expand folder'}
        onClick={handleToggleButtonClick}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 ease-out hover:bg-bg-tertiary hover:text-text-primary motion-reduce:transition-none"
      >
        {toggleIconType === 'plus-minus' ? (
          isExpanded ? (
            <Minus aria-hidden="true" className="size-3.5" />
          ) : (
            <Plus aria-hidden="true" className="size-3.5" />
          )
        ) : (
          <ChevronRight
            aria-hidden="true"
            className={cn(
              'size-3.5 transition-transform duration-150 ease-out motion-reduce:transition-none',
              isExpanded && 'rotate-90',
            )}
          />
        )}
      </button>
    ) : (
      <span aria-hidden="true" className="size-5 shrink-0" />
    );

  const content = children ?? item?.getItemName();
  const Comp = asChild ? Slot.Root : 'span';

  return (
    <Comp
      data-slot="tree-item-label"
      className={cn(
        'flex min-h-8 w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-md px-1.5 py-1 text-body-small-regular text-text-primary transition-colors duration-150 ease-out hover:bg-control-hover motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {toggleControl}
      {content}
    </Comp>
  );
}

export type TreeDragLineProps = ComponentProps<'div'>;

/** Drop position indicator rendered inside `Tree`. Renders nothing unless `dragAndDropFeature` is active. */
function TreeDragLine({ className, style, ...props }: TreeDragLineProps) {
  const treeCtx = useContext(TreeContext);
  if (!treeCtx?.tree.getDragLineStyle) {
    return null;
  }

  const dragLineStyle = treeCtx.tree.getDragLineStyle();

  return (
    <div
      aria-hidden="true"
      data-slot="tree-drag-line"
      style={{ ...dragLineStyle, ...style }}
      className={cn(
        'pointer-events-none absolute z-30 -mt-px h-0.5 bg-fill-primary before:absolute before:-top-[3px] before:left-0 before:size-2 before:rounded-full before:border-2 before:border-fill-primary before:bg-bg-primary',
        className,
      )}
      {...props}
    />
  );
}

export { Tree, TreeDragLine, TreeItem, TreeItemLabel, useTree };
