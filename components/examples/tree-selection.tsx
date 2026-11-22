'use client';

import { useMemo, useState } from 'react';
import { Folder, FolderOpen } from 'lucide-react';
import { CheckboxIndicator } from '@/components/ui/checkbox';
import {
  hotkeysCoreFeature,
  syncDataLoaderFeature,
  Tree,
  TreeItem,
  TreeItemLabel,
  useTree,
} from '@/components/ui/tree';

type DemoNode =
  | { type: 'root' }
  | { type: 'folder'; name: string }
  | { type: 'file'; name: string };

const DEMO_ROOT_ID = 'root';

const DEMO_DATA: Record<string, DemoNode> = {
  [DEMO_ROOT_ID]: { type: 'root' },
  'folder:marketing': { type: 'folder', name: 'Marketing' },
  'folder:campaigns': { type: 'folder', name: 'Campaigns' },
  'folder:research': { type: 'folder', name: 'Research' },
  'file:guidelines': { type: 'file', name: 'Brand guidelines.pdf' },
  'file:brief': { type: 'file', name: 'Campaign brief.docx' },
  'file:report': { type: 'file', name: 'Q1 report.pdf' },
  'file:survey': { type: 'file', name: 'Customer survey.csv' },
};

const DEMO_CHILDREN: Record<string, string[]> = {
  [DEMO_ROOT_ID]: ['folder:marketing', 'folder:research'],
  'folder:marketing': ['folder:campaigns', 'file:guidelines'],
  'folder:campaigns': ['file:brief', 'file:report'],
  'folder:research': ['file:survey'],
};

const getDemoNodeLabel = (node: DemoNode) => (node.type === 'root' ? '' : node.name);

export function TreeSelectionExample() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['file:report']);

  const dataLoader = useMemo(
    () => ({
      getItem: (itemId: string) => DEMO_DATA[itemId] ?? { type: 'root' as const },
      getChildren: (itemId: string) => DEMO_CHILDREN[itemId] ?? [],
    }),
    [],
  );

  const tree = useTree<DemoNode>({
    rootItemId: DEMO_ROOT_ID,
    getItemName: (item) => getDemoNodeLabel(item.getItemData()),
    isItemFolder: (item) => {
      const data = item.getItemData();
      return data.type === 'root' || data.type === 'folder';
    },
    dataLoader,
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
    initialState: {
      expandedItems: [DEMO_ROOT_ID, 'folder:marketing', 'folder:campaigns'],
    },
  });

  const toggle = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  };

  return (
    <Tree
      tree={tree}
      aria-label="Files"
      className="w-full max-w-sm rounded-xl border border-border-gray bg-bg-primary p-2"
    >
      {tree.getItems().map((item) => {
        if (item.getId() === DEMO_ROOT_ID) return null;

        const data = item.getItemData();
        if (data.type !== 'file') {
          const FolderIcon = item.isExpanded() ? FolderOpen : Folder;
          return (
            <TreeItem
              key={item.getId()}
              item={item}
              onClick={(event) => event.preventDefault()}
            >
              <TreeItemLabel item={item}>
                <FolderIcon
                  aria-hidden="true"
                  className="size-4 shrink-0 text-text-secondary"
                />
                <span className="min-w-0 truncate">{getDemoNodeLabel(data)}</span>
              </TreeItemLabel>
            </TreeItem>
          );
        }

        return (
          <TreeItem
            key={item.getId()}
            item={item}
            onClick={(event) => {
              event.preventDefault();
              toggle(item.getId());
            }}
          >
            <TreeItemLabel item={item}>
              <CheckboxIndicator checked={selectedIds.includes(item.getId())} />
              <span className="min-w-0 truncate">{data.name}</span>
            </TreeItemLabel>
          </TreeItem>
        );
      })}
    </Tree>
  );
}
