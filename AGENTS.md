# Fumadocs

Before building or changing UI, read DESIGN.md.

This site is built with [Fumadocs](https://fumadocs.dev) on Next.js. The APIs and conventions of Fumadocs may differ from your training data, so check its docs for the task at hand:

- Writing pages: https://fumadocs.dev/docs/next/markdown.md
- Organizing pages and folders: https://fumadocs.dev/docs/next/page-conventions.md
- Customizing the UI: https://fumadocs.dev/docs/next/guides/customize-ui.md
- Changing the theme and colors: https://fumadocs.dev/docs/ui/theme.md
- Upgrading Fumadocs: https://fumadocs.dev/docs/next/upgrade.md
- Other tasks: https://fumadocs.dev/llms.txt lists every docs page.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## ui-sdk

Before using ui-sdk, follow the `ui-sdk` skill if it's installed, and read `node_modules/@ui-sdk/react/docs/1lms.txt` (or `node_modules/@ui-sdk/react/docs/llms.txt`). To build a new component, also search `node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it.

# Docs

- Framework: The docs framework
  - [Introduction](https://fumadocs.dev/docs.md): The documentation framework for React
  - [Next.js](https://fumadocs.dev/docs/next/llms.txt)
  - [React Router](https://fumadocs.dev/docs/react-router/llms.txt)
  - [TanStack Start](https://fumadocs.dev/docs/tanstack-start/llms.txt)
  - [Waku](https://fumadocs.dev/docs/waku/llms.txt)
  - [Astro](https://fumadocs.dev/docs/astro/llms.txt)
- [Fumadocs UI](https://fumadocs.dev/docs/ui/llms-full.txt): The default theme

  - **Introduction**
  - [Overview](https://fumadocs.dev/docs/ui.md): The default theme of Fumadocs
  - [Component Library](https://fumadocs.dev/docs/ui/component-library.md): The underlying headless component library.
  - [Themes](https://fumadocs.dev/docs/ui/theme.md): Add Theme to Fumadocs UI

  - **References**
  - [Search UI](https://fumadocs.dev/docs/ui/search.md): The UI for document search
  - [Translations](https://fumadocs.dev/docs/ui/translations.md): Adding Translations to UI
  - [Components](https://fumadocs.dev/docs/ui/components/llms-full.txt)
    - [Components](https://fumadocs.dev/docs/ui/components.md): Additional components to improve your docs
    - [Accordion](https://fumadocs.dev/docs/ui/components/accordion.md): Add Accordions to your documentation
    - [Auto Type Table](https://fumadocs.dev/docs/ui/components/auto-type-table.md): Auto-generated type table
    - [Banner](https://fumadocs.dev/docs/ui/components/banner.md): Add a banner to your site
    - [Code Block](https://fumadocs.dev/docs/ui/components/codeblock.md): Displaying Shiki highlighted code blocks
    - [Code Block (Dynamic)](https://fumadocs.dev/docs/ui/components/dynamic-codeblock.md): A codeblock that also highlights code
    - [Files](https://fumadocs.dev/docs/ui/components/files.md): Display file structure in your documentation
    - [GitHub Info](https://fumadocs.dev/docs/ui/components/github-info.md): Display your GitHub repository information
    - [Graph View](https://fumadocs.dev/docs/ui/components/graph-view.md): A graph of all pages.
    - [Zoomable Image](https://fumadocs.dev/docs/ui/components/image-zoom.md): Allow zoom-in images in your documentation
    - [Inline TOC](https://fumadocs.dev/docs/ui/components/inline-toc.md): Add Inline TOC into your documentation
    - [Steps](https://fumadocs.dev/docs/ui/components/steps.md): Adding steps to your docs
    - [Tabs](https://fumadocs.dev/docs/ui/components/tabs.md): A Tabs component built with Base UI, with additional features such as persistent and shared value.
    - [Type Table](https://fumadocs.dev/docs/ui/components/type-table.md): A table for documenting types
  - [Layouts](https://fumadocs.dev/docs/ui/layouts/llms-full.txt)
    - [Layouts](https://fumadocs.dev/docs/ui/layouts.md): A list of layout components.

    - **Configurations**
    - [Layout Links](https://fumadocs.dev/docs/ui/layouts/links.md): Navigation configurations on all layouts.
    - [Navbar](https://fumadocs.dev/docs/ui/layouts/nav.md): Navbar/header configurations.

    - **Components**
    - [Docs Layout](https://fumadocs.dev/docs/ui/layouts/docs.md): The layout of documentation
    - [Flux Layout](https://fumadocs.dev/docs/ui/layouts/flux.md): An aggressively minimal layout for docs
    - [Glass Layout](https://fumadocs.dev/docs/ui/layouts/glass.md): A docs layout with a floating, translucent sidebar and header
    - [Home Layout](https://fumadocs.dev/docs/ui/layouts/home-layout.md): Shared layout for other pages
    - [Notebook Layout](https://fumadocs.dev/docs/ui/layouts/notebook.md): A compact version of Docs Layout
    - [Spacious Layout](https://fumadocs.dev/docs/ui/layouts/spacious.md): A less compact version of Docs Layout
    - [Docs Page](https://fumadocs.dev/docs/ui/layouts/page.md): A page in your documentation
    - [Root Provider](https://fumadocs.dev/docs/ui/layouts/root-provider.md): The context provider of Fumadocs UI.
- [Fumadocs Core](https://fumadocs.dev/docs/headless/llms-full.txt): The headless library

  - **Guide**
  - [Introduction](https://fumadocs.dev/docs/headless.md): Getting started with core library
  - [Search](https://fumadocs.dev/docs/headless/search/llms-full.txt)
    - [Search](https://fumadocs.dev/docs/headless/search.md): Configure Search in Fumadocs
    - [Algolia Search](https://fumadocs.dev/docs/headless/search/algolia.md): Integrate Algolia Search with Fumadocs
    - [FlexSearch](https://fumadocs.dev/docs/headless/search/flexsearch.md): Fast & minimal document search
    - [Meilisearch](https://fumadocs.dev/docs/headless/search/meilisearch.md): Integrate Meilisearch with Fumadocs
    - [Mixedbread](https://fumadocs.dev/docs/headless/search/mixedbread.md): Integrate Mixedbread Search with Fumadocs
    - [Orama Cloud](https://fumadocs.dev/docs/headless/search/orama-cloud.md): Integrate with Orama Cloud
    - [Built-in Search](https://fumadocs.dev/docs/headless/search/orama.md): Built-in document search of Fumadocs
    - [Trieve Search](https://fumadocs.dev/docs/headless/search/trieve.md): Integrate Trieve Search with Fumadocs
    - [Typesense Search](https://fumadocs.dev/docs/headless/search/typesense.md): Integrate Typesense Search with Fumadocs

  - **API References**
  - [Page Tree](https://fumadocs.dev/docs/headless/page-tree.md): The structure of page tree.
  - [Internationalization](https://fumadocs.dev/docs/headless/internationalization/llms-full.txt)
    - [Configuration](https://fumadocs.dev/docs/headless/internationalization/config.md): Shared i18n configuration
    - [Middleware](https://fumadocs.dev/docs/headless/internationalization/middleware.md): Next.js proxy for implementing i18n routing
  - [Components](https://fumadocs.dev/docs/headless/components/llms-full.txt)
    - [Components](https://fumadocs.dev/docs/headless/components.md): Blocks for your docs
    - [Breadcrumb](https://fumadocs.dev/docs/headless/components/breadcrumb.md): The navigation component at the top of the screen
    - [Link](https://fumadocs.dev/docs/headless/components/link.md): A Link component that handles external links
    - [TOC](https://fumadocs.dev/docs/headless/components/toc.md): Table of Contents
  - [Utilities](https://fumadocs.dev/docs/headless/utils/llms-full.txt)
    - [Utilities](https://fumadocs.dev/docs/headless/utils.md): Utilities to provide extra functionality to your docs
    - [Get TOC](https://fumadocs.dev/docs/headless/utils/get-toc.md): Parse Table of contents from markdown/mdx content
    - [Last Modified Time](https://fumadocs.dev/docs/headless/utils/git-last-edit.md): Get the last edit time of a file in Github repository
    - [Markdown Rendering](https://fumadocs.dev/docs/headless/utils/markdown.md): Render React elements into Markdown.
    - [MCP](https://fumadocs.dev/docs/headless/utils/mcp.md): Expose your docs to AI agents as MCP tools.
    - [Negotiation](https://fumadocs.dev/docs/headless/utils/negotiation.md): Content negotiation utilities.
    - [Page Tree Utils](https://fumadocs.dev/docs/headless/utils/page-tree.md): Common utilities to interact with page tree.
    - [Highlighter](https://fumadocs.dev/docs/headless/utils/shiki.md): Highlight code with Shiki, or a highlighter of your choice.
  - [MDX Plugins](https://fumadocs.dev/docs/headless/mdx/llms-full.txt)
    - [MDX Plugins](https://fumadocs.dev/docs/headless/mdx.md): Useful remark & rehype plugins for your docs.
    - [Headings](https://fumadocs.dev/docs/headless/mdx/headings.md): Process headings from your document
    - [Package Install](https://fumadocs.dev/docs/headless/mdx/install.md): Generate code blocks for installing packages
    - [Rehype Code](https://fumadocs.dev/docs/headless/mdx/rehype-code.md): Code syntax highlighter
    - [Remark Admonition](https://fumadocs.dev/docs/headless/mdx/remark-admonition.md): Use Admonition in Fumadocs
    - [Remark Image](https://fumadocs.dev/docs/headless/mdx/remark-image.md): Adding size attributes to images.
    - [Remark Include](https://fumadocs.dev/docs/headless/mdx/remark-include.md): Reuse content from other files.
    - [Remark LLMs](https://fumadocs.dev/docs/headless/mdx/remark-llms.md): Export the Markdown of your documents for LLMs.
    - [Remark Files](https://fumadocs.dev/docs/headless/mdx/remark-mdx-files.md): Generate files from codeblocks.
    - [Remark NPM](https://fumadocs.dev/docs/headless/mdx/remark-npm.md): Generate code blocks for package managers
    - [Remark Show](https://fumadocs.dev/docs/headless/mdx/remark-show.md): Show content on a condition.
    - [Remark Steps](https://fumadocs.dev/docs/headless/mdx/remark-steps.md): Generate steps from headings
    - [Remark TS to JS](https://fumadocs.dev/docs/headless/mdx/remark-ts2js.md): A remark plugin to transform TypeScript codeblocks into two tabs of codeblock with its JavaScript variant.
    - [Stringification](https://fumadocs.dev/docs/headless/mdx/stringification.md): How Fumadocs turns your documents into Markdown.
    - [Remark Structure](https://fumadocs.dev/docs/headless/mdx/structure.md): Extract search records from your documents.

  - **Sources**
  - [Loader API](https://fumadocs.dev/docs/headless/source-api/llms-full.txt)
    - [Loader API](https://fumadocs.dev/docs/headless/source-api.md): Turn content sources into a unified interface
    - [Loader Plugins](https://fumadocs.dev/docs/headless/source-api/plugins.md): Extend Loader API
    - [Source](https://fumadocs.dev/docs/headless/source-api/source.md): Setup sources for Loader API
  - [Page Slugs & Page Tree](https://fumadocs.dev/docs/headless/page-conventions.md): Customize generated page slugs and page tree.
  - [Content Collections](https://fumadocs.dev/docs/headless/content-collections.md): Use Content Collections for Fumadocs
- [Fumadocs MDX](https://fumadocs.dev/docs/mdx/llms-full.txt): The official content source

  - **Guide**
  - [Getting Started](https://fumadocs.dev/docs/mdx.md): Introducing Fumadocs MDX, the official content source of Fumadocs.
  - [Performance](https://fumadocs.dev/docs/mdx/performance.md): The performance of Fumadocs MDX
  - [Accessing Collections](https://fumadocs.dev/docs/mdx/entry/llms-full.txt)
    - [Accessing Collections](https://fumadocs.dev/docs/mdx/entry.md): Access collection outputs from entry files.
    - [Browser Entry](https://fumadocs.dev/docs/mdx/entry/browser.md): Access collections from browser/client environment.
    - [Dynamic Entry](https://fumadocs.dev/docs/mdx/entry/dynamic.md): Accessing your collections with on-demand compilation.
    - [Import MDX Files](https://fumadocs.dev/docs/mdx/entry/import.md): Importing MDX files directly.
    - [Server Entry](https://fumadocs.dev/docs/mdx/entry/server.md): Accessing collection outputs from server.
  - [Macro API](https://fumadocs.dev/docs/mdx/macro.md): Define collections in your app with fumadocs-mdx/macro.

  - **Integrations**
  - [Next.js](https://fumadocs.dev/docs/mdx/next.md): Use Fumadocs MDX with Next.js
  - [Vite](https://fumadocs.dev/docs/mdx/vite.md): Use Fumadocs MDX with Vite
  - [Runtime Loader](https://fumadocs.dev/docs/mdx/loader/llms-full.txt)
    - [Runtime Loader](https://fumadocs.dev/docs/mdx/loader.md): Fumadocs MDX loader integration.
    - [Bun](https://fumadocs.dev/docs/mdx/loader/bun.md): Access content in Bun.
    - [Node.js](https://fumadocs.dev/docs/mdx/loader/node.md): Access content in Node.js runtime.

  - **Configuration**
  - [Collections](https://fumadocs.dev/docs/mdx/collections.md): Collection of content data for your app
  - [Global Options](https://fumadocs.dev/docs/mdx/global.md): Customize Fumadocs MDX
  - [MDX Presets](https://fumadocs.dev/docs/mdx/mdx.md): Customize the default configurations for MDX processor.

  - **Features**
  - [Include](https://fumadocs.dev/docs/mdx/include.md): Reuse content from other files.
  - [Last Modified Time](https://fumadocs.dev/docs/mdx/last-modified.md): Output the last modified time of a document
  - [Lazy Loading](https://fumadocs.dev/docs/mdx/async.md): Configure lazy loading on collection outputs.
  - [Generate Types](https://fumadocs.dev/docs/mdx/typegen.md): Generate types without running dev/build server
  - [Workspace](https://fumadocs.dev/docs/mdx/workspace.md): Use Fumadocs MDX in multiple workspace.
- [Fumadocs CLI](https://fumadocs.dev/docs/cli/llms-full.txt): CLI tools for docs & automation
  - [User Guide](https://fumadocs.dev/docs/cli.md): The CLI tool that automates setups and installs components.
  - [create-fumadocs-app](https://fumadocs.dev/docs/cli/create-fumadocs-app.md): The CLI to create new Fumadocs apps
  - [Preview](https://fumadocs.dev/docs/cli/preview.md): A light tool to view Markdown files.

