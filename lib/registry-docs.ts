import { registryNamespace } from '@/lib/shared';

export interface RegistryFileEntry {
  path: string;
  type: string;
  target?: string;
}

export interface RegistryItemEntry {
  name: string;
  type: string;
  title?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFileEntry[];
  css?: unknown;
  cssVars?: unknown;
}

export interface UiDependency {
  name: string;
  title: string;
}

export interface InstallExpectations {
  rootItem: RegistryItemEntry | undefined;
  files: string[];
  supportingFiles: string[];
  needsUtils: boolean;
  uiDependencies: UiDependency[];
  shadcnItems: string[];
  registryItems: string[];
  packages: string[];
  hasCss: boolean;
}

const MAX_LISTED_FILES = 5;

const TYPE_DIRECTORIES: Record<string, string> = {
  'registry:component': 'components',
  'registry:ui': 'components/ui',
  'registry:hook': 'hooks',
  'registry:lib': 'lib',
};

/** Converts a kebab-case registry slug into a title-cased display string. */
export function formatTitleFromSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/** Resolves the workspace-relative target path for a registry file entry without a leading `@`. */
export function getFilePath(file: RegistryFileEntry): string {
  if (file.target) {
    return file.target.replace(/^@/, '');
  }
  if (file.path) {
    return file.path;
  }
  const directory = TYPE_DIRECTORIES[file.type];
  return directory ?? '';
}

function getCommonDirectory(files: string[]): string {
  const [first = [], ...rest] = files.map((file) => file.split('/').slice(0, -1));
  const length = first.findIndex(
    (segment, index) => !rest.every((parts) => parts[index] === segment),
  );
  return first.slice(0, length === -1 ? undefined : length).join('/');
}

/** Summarizes long file lists to their shared directory when exceeding `MAX_LISTED_FILES`. */
export function formatFiles(files: string[]): string[] {
  if (files.length <= MAX_LISTED_FILES) {
    return files;
  }
  return [`${getCommonDirectory(files)}/ (${files.length} files)`];
}

/** Traverses a registry item and its transitive dependencies to derive install requirements. */
export function collectInstallExpectations(
  name: string,
  namespace: string = registryNamespace,
  items: RegistryItemEntry[] = [],
): InstallExpectations {
  const itemsByName = new Map(items.map((entry) => [entry.name, entry]));
  const rootItem = itemsByName.get(name);
  const supportingFiles = new Set<string>();
  const uiDepsMap = new Map<string, UiDependency>();
  const shadcnItems = new Set<string>();
  const packages = new Set<string>();
  const visited = new Set<string>();
  let needsUtils = false;
  let hasCss = false;

  const collect = (item: RegistryItemEntry, isRoot: boolean) => {
    if (visited.has(item.name)) return;
    visited.add(item.name);

    hasCss ||= Boolean(item.css || item.cssVars);

    if (!isRoot) {
      if (item.name === 'utils') {
        needsUtils = true;
      } else if (item.type === 'registry:ui') {
        uiDepsMap.set(item.name, {
          name: item.name,
          title: item.title ?? formatTitleFromSlug(item.name),
        });
      } else if (item.name !== 'theme') {
        for (const file of item.files ?? []) {
          const filePath = getFilePath(file);
          if (filePath) supportingFiles.add(filePath);
        }
      }
    }

    for (const pkg of [...(item.dependencies ?? []), ...(item.devDependencies ?? [])]) {
      packages.add(pkg);
    }

    for (const dep of item.registryDependencies ?? []) {
      const localName = dep.startsWith(`${namespace}/`)
        ? dep.slice(namespace.length + 1)
        : undefined;
      const localItem = localName ? itemsByName.get(localName) : itemsByName.get(dep);

      if (localItem) {
        collect(localItem, false);
      } else if (!dep.includes('/')) {
        shadcnItems.add(dep);
      }
    }
  };

  if (rootItem) {
    collect(rootItem, true);
  }

  return {
    rootItem,
    files: (rootItem?.files ?? []).map(getFilePath).filter(Boolean),
    supportingFiles: [...supportingFiles],
    needsUtils,
    uiDependencies: [...uiDepsMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
    shadcnItems: [...shadcnItems].sort((a, b) => a.localeCompare(b)),
    registryItems: (rootItem?.registryDependencies ?? []).filter((dep) =>
      dep.includes('/'),
    ),
    packages: [...packages].sort((a, b) => a.localeCompare(b)),
    hasCss,
  };
}
