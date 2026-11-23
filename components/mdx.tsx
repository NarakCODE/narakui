import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tab, Tabs as FumadocsTabs } from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { ComponentPreview } from '@/components/component-preview';
import { CodeBlockCommand } from '@/components/docs/code-block-command';
import { CodeCollapsibleWrapper } from '@/components/docs/code-collapsible-wrapper';
import { CodeTabs, TabsListInstallType } from '@/components/docs/code-tabs';
import { ComponentInstallation } from '@/components/docs/component-installation';
import { ComponentSource } from '@/components/docs/component-source';
import {
  DocsTabs,
  DocsTabsContent,
  DocsTabsIndicator,
  DocsTabsList,
  DocsTabsTrigger,
} from '@/components/docs/docs-tabs';
import { InstallPrompt } from '@/components/docs/install-prompt';
import {
  CodeBlockCaption,
  CodeBlockFrame,
  MdxPre,
} from '@/components/docs/mdx-code-block';
import { Callout, Step, Steps } from '@/components/docs/mdx-extras';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: MdxPre,
    Callout,
    CodeBlockCaption,
    CodeBlockCommand,
    CodeBlockFrame,
    CodeCollapsibleWrapper,
    CodeTabs,
    ComponentInstallation,
    ComponentPreview,
    ComponentSource,
    DocsTabs,
    InstallPrompt,
    Step,
    Steps,
    Tab,
    Tabs: FumadocsTabs,
    TabsContent: DocsTabsContent,
    TabsIndicator: DocsTabsIndicator,
    TabsList: DocsTabsList,
    TabsListInstallType,
    TabsTrigger: DocsTabsTrigger,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
