'use client';

import { useMemo } from 'react';
import { FileText, Folder, FolderOpen } from 'lucide-react';
import {
  hotkeysCoreFeature,
  syncDataLoaderFeature,
  Tree,
  TreeItem,
  TreeItemLabel,
  useTree,
  type ItemInstance,
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

function DemoLabel({ item }: { item: ItemInstance<DemoNode> }) {
  const data = item.getItemData();
  const Icon =
    data.type === 'folder'
      ? item.isExpanded()
        ? FolderOpen
        : Folder
      : FileText;

  return (
    <TreeItemLabel item={item}>
      <Icon aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
      <span className="min-w-0 truncate">{getDemoNodeLabel(data)}</span>
    </TreeItemLabel>
  );
}

export function TreeBasicExample() {
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
    initialState: { expandedItems: [DEMO_ROOT_ID, 'folder:marketing'] },
  });

  return (
    <Tree
      tree={tree}
      aria-label="Files"
      className="w-full max-w-sm rounded-xl border border-border-gray bg-bg-primary p-2"
    >
      {tree.getItems().map((item) =>
        item.getId() === DEMO_ROOT_ID ? null : (
          <TreeItem key={item.getId()} item={item}>
            <DemoLabel item={item} />
          </TreeItem>
        ),
      )}
    </Tree>
  );
}
