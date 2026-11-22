import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';

/** Constrained container demonstrating proportional crumb truncation with full-label tooltips. */
export function BreadcrumbTruncation() {
  return (
    <div className="w-full max-w-80 rounded-md border border-fill-quaternary bg-bg-primary p-1">
      <Breadcrumb>
        <BreadcrumbItem href="#projects" label="Projects" />
        <BreadcrumbItem href="#launch" label="Answer engine launch plan for the spring campaign" />
        <BreadcrumbItem label="Citation gaps in ChatGPT and Perplexity answers" />
      </Breadcrumb>
    </div>
  );
}
