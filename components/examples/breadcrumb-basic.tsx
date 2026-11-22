import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';

/** Basic three-level breadcrumb trail using links and a plain-text current page. */
export function BreadcrumbBasic() {
  return (
    <Breadcrumb className="flex-initial">
      <BreadcrumbItem href="#projects" label="Projects" />
      <BreadcrumbItem href="#q4-visibility" label="Q4 visibility push" />
      <BreadcrumbItem label="Competitor citation audit" />
    </Breadcrumb>
  );
}
