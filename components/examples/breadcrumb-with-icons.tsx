import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';

/** Breadcrumb trail pairing leading icons with hierarchical labels. */
export function BreadcrumbWithIcons() {
  return (
    <Breadcrumb className="flex-initial">
      <BreadcrumbItem href="#library" label="Library" startIcon="library" />
      <BreadcrumbItem href="#brand-guidelines" label="Brand guidelines" startIcon="folder" />
      <BreadcrumbItem label="Tone of voice" startIcon="file-text" />
    </Breadcrumb>
  );
}
