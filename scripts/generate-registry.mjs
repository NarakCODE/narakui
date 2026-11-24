#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';

const ROOT_DIR = process.cwd();
const UI_DIR = path.join(ROOT_DIR, 'components', 'ui');
const LIQUID_GLASS_DIR = path.join(ROOT_DIR, 'components', 'liquid-glass');
const DOCS_COMPONENTS_DIR = path.join(ROOT_DIR, 'content', 'docs', 'components');
const DESIGN_SYSTEM_CSS_PATH = path.join(ROOT_DIR, 'app', 'design-system.css');
const REGISTRY_PATH = path.join(ROOT_DIR, 'registry.json');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'r');

const PEER_PACKAGES = new Set(['react', 'react-dom', 'next']);
const FORBIDDEN_PACKAGES = new Set(['fumadocs-core', 'fumadocs-ui', 'fumadocs-mdx']);

const FALLBACK_METADATA = {
  'empty-state': {
    title: 'Empty State',
    description:
      'Structured placeholder view with illustration or icon, title, description, and primary or secondary actions.',
  },
  'input-group': {
    title: 'Input Group',
    description:
      'Composable input wrapper pairing text inputs or textareas with inline or block addons, icons, text, and action buttons.',
  },
  toggle: {
    title: 'Toggle',
    description:
      'Two-state pressable button control supporting default and outline variants across compact and standard sizes.',
  },
};

function parseArgs(argv) {
  const args = {
    namespace: '@narakui',
    baseUrl: process.env.REGISTRY_BASE_URL,
    homepage: process.env.NEXT_PUBLIC_SITE_URL || 'https://ui.narakcode.dev',
    check: false,
    verifyOutput: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--namespace' && i + 1 < argv.length) {
      args.namespace = argv[++i];
    } else if (arg === '--base-url' && i + 1 < argv.length) {
      args.baseUrl = argv[++i];
    } else if (arg === '--homepage' && i + 1 < argv.length) {
      args.homepage = argv[++i];
    } else if (arg === '--check') {
      args.check = true;
    } else if (arg === '--verify-output') {
      args.verifyOutput = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(
        [
          'Usage: node scripts/generate-registry.mjs [options]',
          '',
          'Options:',
          '  --namespace <ns>     Registry namespace for registryDependencies when --base-url is empty (default: @narakui)',
          '  --base-url <url>     Base URL for registryDependencies (<url>/<name>.json); defaults to <homepage>/r',
          '  --homepage <url>     Registry homepage URL (default: https://ui.narakcode.dev)',
          '  --check              Fail if registry.json differs from generated output',
          '  --verify-output      Validate built public/r/*.json and public/r/registry.json files',
        ].join('\n'),
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown CLI argument: ${arg}`);
    }
  }

  args.homepage = args.homepage.replace(/\/+$/, '');
  if (args.baseUrl === undefined) {
    args.baseUrl = `${args.homepage}/r`;
  }

  return args;
}

function makeDepRef(name, { namespace, baseUrl }) {
  if (baseUrl) {
    return `${baseUrl.replace(/\/+$/, '')}/${name}.json`;
  }
  const normalizedNs = namespace.startsWith('@') ? namespace : `@${namespace}`;
  return `${normalizedNs}/${name}`;
}

function titleCaseFromSlug(slug) {
  return slug
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
    .join(' ');
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function readMdxMetadata(slug) {
  const mdxPath = path.join(DOCS_COMPONENTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    return (
      FALLBACK_METADATA[slug] ?? {
        title: titleCaseFromSlug(slug),
        description: `${titleCaseFromSlug(slug)} component for the NarakUI design system.`,
      }
    );
  }

  const content = fs.readFileSync(mdxPath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {
      title: titleCaseFromSlug(slug),
      description: `${titleCaseFromSlug(slug)} component for the NarakUI design system.`,
    };
  }

  const frontmatter = match[1];
  const extractField = (field) => {
    const lineMatch = frontmatter.match(new RegExp(`^${field}:\\s*(.+)$`, 'm'));
    if (!lineMatch) return undefined;
    let raw = lineMatch[1].trim();
    if (
      (raw.startsWith('"') && raw.endsWith('"')) ||
      (raw.startsWith("'") && raw.endsWith("'"))
    ) {
      raw = raw.slice(1, -1);
    }
    return raw.trim();
  };

  return {
    title: extractField('title') || titleCaseFromSlug(slug),
    description:
      extractField('description') ||
      `${titleCaseFromSlug(slug)} component for the NarakUI design system.`,
  };
}

function normalizePackageName(specifier) {
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/');
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier;
  }
  return specifier.split('/')[0];
}

function extractModuleSpecifiers(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const tokens = [];
  let i = 0;

  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];

    // Whitespace
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    // Line comment
    if (ch === '/' && next === '/') {
      i += 2;
      while (i < src.length && src[i] !== '\n') i += 1;
      continue;
    }

    // Block comment
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }

    // String literal ('...' or "...")
    if (ch === "'" || ch === '"') {
      const quote = ch;
      let val = '';
      i += 1;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\') {
          i += 1;
          if (i < src.length) val += src[i];
        } else {
          val += src[i];
        }
        i += 1;
      }
      i += 1;
      tokens.push({ type: 'string', value: val });
      continue;
    }

    // Template literal (`...`) — skip contents (keep ${...} expressions balanced)
    if (ch === '`') {
      i += 1;
      let braceDepth = 0;
      while (i < src.length) {
        if (src[i] === '\\') {
          i += 2;
          continue;
        }
        if (braceDepth === 0 && src[i] === '`') {
          i += 1;
          break;
        }
        if (src[i] === '$' && src[i + 1] === '{') {
          braceDepth += 1;
          i += 2;
          continue;
        }
        if (braceDepth > 0 && src[i] === '}') {
          braceDepth -= 1;
        }
        i += 1;
      }
      tokens.push({ type: 'template', value: '' });
      continue;
    }

    // Identifier / keyword
    if (/[A-Za-z_$]/.test(ch)) {
      let ident = ch;
      i += 1;
      while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) {
        ident += src[i];
        i += 1;
      }
      tokens.push({ type: 'ident', value: ident });
      continue;
    }

    tokens.push({ type: 'punct', value: ch });
    i += 1;
  }

  const specifiers = new Set();

  for (let idx = 0; idx < tokens.length; idx += 1) {
    const tok = tokens[idx];
    if (tok.type !== 'ident') continue;

    // Dynamic import("...") or type import("...")
    if (
      tok.value === 'import' &&
      tokens[idx + 1]?.type === 'punct' &&
      tokens[idx + 1].value === '(' &&
      tokens[idx + 2]?.type === 'string'
    ) {
      specifiers.add(tokens[idx + 2].value);
      continue;
    }

    // Side-effect import "..."
    if (tok.value === 'import' && tokens[idx + 1]?.type === 'string') {
      specifiers.add(tokens[idx + 1].value);
      continue;
    }

    // Static import ... from "..." or export ... from "..."
    if (tok.value === 'import' || tok.value === 'export') {
      // Only scan inside the import/export clause until ';' or statement boundary
      const prev = tokens[idx - 1];
      if (prev && prev.type === 'punct' && prev.value === '.') continue;

      let j = idx + 1;
      let braceDepth = 0;
      while (j < tokens.length) {
        const cur = tokens[j];
        if (cur.type === 'punct' && cur.value === '{') braceDepth += 1;
        else if (cur.type === 'punct' && cur.value === '}') braceDepth = Math.max(0, braceDepth - 1);
        else if (braceDepth === 0 && cur.type === 'punct' && cur.value === ';') break;
        else if (
          braceDepth === 0 &&
          cur.type === 'ident' &&
          cur.value === 'from' &&
          tokens[j + 1]?.type === 'string'
        ) {
          specifiers.add(tokens[j + 1].value);
          break;
        } else if (
          braceDepth === 0 &&
          cur.type === 'ident' &&
          ['function', 'const', 'let', 'var', 'class', 'interface', 'enum', 'default'].includes(
            cur.value,
          ) &&
          tok.value === 'export'
        ) {
          // Local export declaration (e.g. export function foo / export const x), not a re-export
          break;
        }
        j += 1;
      }
    }
  }

  return Array.from(specifiers).sort();
}

function analyzeFileImports(filePath, { uiSlugs, selfSlug, options, allowRelativePrefixes = [] }) {
  const relPath = path.relative(ROOT_DIR, filePath);
  const specifiers = extractModuleSpecifiers(filePath);
  const npmDeps = new Set();
  const registryDeps = new Set();

  for (const spec of specifiers) {
    if (spec.startsWith('node:')) {
      throw new Error(`${relPath}: Node built-in import "${spec}" is not allowed in browser UI registry items.`);
    }

    if (spec.startsWith('.')) {
      const allowed = allowRelativePrefixes.some((prefix) => spec.startsWith(prefix));
      if (!allowed) {
        throw new Error(`${relPath}: Unexpected relative import "${spec}". Use @/ aliases or register the target module.`);
      }
      continue;
    }

    if (spec.startsWith('@/')) {
      if (spec === '@/lib/utils') {
        registryDeps.add(makeDepRef('utils', options));
      } else if (spec === '@/lib/highlighter') {
        registryDeps.add(makeDepRef('highlighter', options));
      } else if (spec === '@/hooks/use-highlighted-code') {
        registryDeps.add(makeDepRef('use-highlighted-code', options));
      } else if (spec.startsWith('@/components/liquid-glass/')) {
        registryDeps.add(makeDepRef('liquid-glass', options));
      } else if (spec.startsWith('@/components/ui/')) {
        const targetSlug = spec.slice('@/components/ui/'.length).replace(/\.(ts|tsx)$/, '');
        if (!uiSlugs.has(targetSlug)) {
          throw new Error(`${relPath}: Imports unknown UI component "${spec}".`);
        }
        if (targetSlug !== selfSlug) {
          registryDeps.add(makeDepRef(targetSlug, options));
        }
      } else {
        throw new Error(`${relPath}: Unmapped internal import "${spec}" would break external consumers.`);
      }
      continue;
    }

    const pkg = normalizePackageName(spec);
    if (FORBIDDEN_PACKAGES.has(pkg)) {
      throw new Error(`${relPath}: Forbidden Fumadocs dependency "${spec}" leaked into registry source.`);
    }
    if (pkg === 'cn' && relPath !== path.join('lib', 'utils.ts')) {
      throw new Error(`${relPath}: Direct import from "${spec}" violates DESIGN.md; import cn from "@/lib/utils".`);
    }
    if (!PEER_PACKAGES.has(pkg)) {
      npmDeps.add(pkg);
    }
  }

  return {
    dependencies: Array.from(npmDeps).sort(),
    registryDependencies: Array.from(registryDeps).sort(),
  };
}

function mergeNestedCssObject(target, key, value) {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    target[key] &&
    typeof target[key] === 'object' &&
    !Array.isArray(target[key])
  ) {
    for (const [childKey, childValue] of Object.entries(value)) {
      mergeNestedCssObject(target[key], childKey, childValue);
    }
    return;
  }
  target[key] = value;
}

function cssContainerToObject(container) {
  const result = {};

  for (const node of container.nodes ?? []) {
    if (node.type === 'comment') continue;

    if (node.type === 'decl') {
      const value = node.important
        ? `${normalizeWhitespace(node.value)} !important`
        : normalizeWhitespace(node.value);
      result[node.prop] = value;
      continue;
    }

    if (node.type === 'rule') {
      const selector = normalizeWhitespace(node.selector);
      const body = cssContainerToObject(node);
      mergeNestedCssObject(result, selector, body);
      continue;
    }

    if (node.type === 'atrule') {
      const params = normalizeWhitespace(node.params);
      const key = params ? `@${node.name} ${params}` : `@${node.name}`;
      if (!node.nodes) {
        result[key] = {};
      } else {
        const body = cssContainerToObject(node);
        mergeNestedCssObject(result, key, body);
      }
    }
  }

  return result;
}

function parseDesignSystemCss() {
  const rawCss = fs.readFileSync(DESIGN_SYSTEM_CSS_PATH, 'utf8');
  if (/--fd-|#nd-docs-layout|#nd-page/.test(rawCss)) {
    throw new Error('app/design-system.css contains Fumadocs-only selectors or --fd-* tokens.');
  }

  const root = postcss.parse(rawCss);
  const themeVars = {};
  const css = {};

  for (const node of root.nodes ?? []) {
    if (node.type === 'comment') continue;

    if (node.type === 'atrule' && node.name === 'theme') {
      for (const child of node.nodes ?? []) {
        if (child.type === 'comment') continue;
        if (child.type === 'decl') {
          const cleanKey = child.prop.replace(/^--/, '');
          themeVars[cleanKey] = normalizeWhitespace(child.value);
        } else if (child.type === 'atrule' && child.name === 'keyframes') {
          const key = `@keyframes ${normalizeWhitespace(child.params)}`;
          mergeNestedCssObject(css, key, cssContainerToObject(child));
        } else {
          throw new Error(`Unsupported node inside @theme in app/design-system.css: ${child.toString()}`);
        }
      }
      continue;
    }

    if (node.type === 'atrule') {
      if (node.name === 'utility') {
        const hasNestedSupports = (node.nodes ?? []).some(
          (child) => child.type === 'atrule' && child.name === 'supports',
        );
        if (hasNestedSupports) {
          throw new Error(
            `@utility ${node.params} contains nested @supports which shadcn@4.23.0 corrupts; hoist @supports to top-level.`,
          );
        }
      }

      const params = normalizeWhitespace(node.params);
      const key = params ? `@${node.name} ${params}` : `@${node.name}`;
      if (!node.nodes) {
        css[key] = {};
      } else {
        mergeNestedCssObject(css, key, cssContainerToObject(node));
      }
      continue;
    }

    if (node.type === 'rule') {
      const selector = normalizeWhitespace(node.selector);
      mergeNestedCssObject(css, selector, cssContainerToObject(node));
    }
  }

  if (!css['@import "tw-animate-css"']) {
    throw new Error('app/design-system.css must include @import "tw-animate-css";');
  }
  if (!css['@custom-variant dark (&:is(.dark *))']) {
    throw new Error('app/design-system.css must include @custom-variant dark (&:is(.dark *));');
  }
  if (!css[':root'] || !css['.dark']) {
    throw new Error('app/design-system.css must define both :root and .dark token blocks.');
  }

  return {
    cssVars: {
      theme: themeVars,
    },
    css,
  };
}

function buildRegistry(options) {
  const uiFiles = fs
    .readdirSync(UI_DIR)
    .filter((file) => file.endsWith('.tsx'))
    .sort();
  const uiSlugs = new Set(uiFiles.map((file) => file.replace(/\.tsx$/, '')));

  const { cssVars, css } = parseDesignSystemCss();

  const themeItem = {
    name: 'theme',
    type: 'registry:theme',
    title: 'NarakUI Theme',
    description:
      'NarakUI design tokens, light and warm dark themes, typography utilities, elevation shadows, animations, and surface styles for Tailwind CSS v4.',
    dependencies: ['tw-animate-css'],
    cssVars,
    css,
  };

  const utilsAnalysis = analyzeFileImports(path.join(ROOT_DIR, 'lib', 'utils.ts'), {
    uiSlugs,
    selfSlug: null,
    options,
  });
  const utilsItem = {
    name: 'utils',
    type: 'registry:lib',
    title: 'NarakUI Utilities',
    description:
      'Custom cn class-merging helper configured with NarakUI typography, gradient, and shadow class groups.',
    dependencies: utilsAnalysis.dependencies,
    files: [
      {
        path: 'lib/utils.ts',
        type: 'registry:lib',
      },
    ],
  };

  const liquidGlassFiles = fs
    .readdirSync(LIQUID_GLASS_DIR)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
    .sort();
  const liquidGlassDeps = new Set();
  const liquidGlassRegDeps = new Set();
  for (const file of liquidGlassFiles) {
    const analysis = analyzeFileImports(path.join(LIQUID_GLASS_DIR, file), {
      uiSlugs,
      selfSlug: null,
      options,
      allowRelativePrefixes: ['./'],
    });
    analysis.dependencies.forEach((d) => liquidGlassDeps.add(d));
    analysis.registryDependencies.forEach((d) => liquidGlassRegDeps.add(d));
  }
  const liquidGlassItem = {
    name: 'liquid-glass',
    type: 'registry:component',
    title: 'Liquid Glass',
    description:
      'WebGL2 refractive liquid glass engine, DOM backdrop snapshotter, GlassLayer, and GlassCard primitives.',
    ...(liquidGlassDeps.size ? { dependencies: Array.from(liquidGlassDeps).sort() } : {}),
    ...(liquidGlassRegDeps.size
      ? { registryDependencies: Array.from(liquidGlassRegDeps).sort() }
      : {}),
    files: liquidGlassFiles.map((file) => ({
      path: `components/liquid-glass/${file}`,
      type: 'registry:component',
      target: `@components/liquid-glass/${file}`,
    })),
  };

  const highlighterAnalysis = analyzeFileImports(path.join(ROOT_DIR, 'lib', 'highlighter.tsx'), {
    uiSlugs,
    selfSlug: null,
    options,
  });
  const highlighterItem = {
    name: 'highlighter',
    type: 'registry:lib',
    title: 'Shiki Highlighter',
    description:
      'On-demand Shiki JavaScript-engine syntax highlighter with dual light/dark GitHub themes and HTML export.',
    dependencies: highlighterAnalysis.dependencies,
    files: [
      {
        path: 'lib/highlighter.tsx',
        type: 'registry:lib',
      },
    ],
  };

  const hookAnalysis = analyzeFileImports(
    path.join(ROOT_DIR, 'hooks', 'use-highlighted-code.ts'),
    {
      uiSlugs,
      selfSlug: null,
      options,
    },
  );
  const useHighlightedCodeItem = {
    name: 'use-highlighted-code',
    type: 'registry:hook',
    title: 'useHighlightedCode',
    description: 'Streaming-safe incremental syntax highlighting React hook powered by Shiki.',
    ...(hookAnalysis.dependencies.length ? { dependencies: hookAnalysis.dependencies } : {}),
    ...(hookAnalysis.registryDependencies.length
      ? { registryDependencies: hookAnalysis.registryDependencies }
      : {}),
    files: [
      {
        path: 'hooks/use-highlighted-code.ts',
        type: 'registry:hook',
      },
    ],
  };

  const uiItems = uiFiles.map((file) => {
    const slug = file.replace(/\.tsx$/, '');
    const fullPath = path.join(UI_DIR, file);
    const meta = readMdxMetadata(slug);
    const analysis = analyzeFileImports(fullPath, {
      uiSlugs,
      selfSlug: slug,
      options,
    });

    const regDeps = new Set([makeDepRef('theme', options), ...analysis.registryDependencies]);

    const item = {
      name: slug,
      type: 'registry:ui',
      title: meta.title,
      description: meta.description,
    };

    if (analysis.dependencies.length > 0) {
      item.dependencies = analysis.dependencies;
    }

    item.registryDependencies = Array.from(regDeps).sort((a, b) => {
      const rank = (ref) => {
        if (ref.endsWith('/theme') || ref.endsWith('/theme.json')) return 0;
        if (ref.endsWith('/utils') || ref.endsWith('/utils.json')) return 1;
        return 2;
      };
      const diff = rank(a) - rank(b);
      return diff !== 0 ? diff : a.localeCompare(b);
    });

    item.files = [
      {
        path: `components/ui/${file}`,
        type: 'registry:ui',
      },
    ];

    return item;
  });

  const allItem = {
    name: 'all',
    type: 'registry:item',
    title: 'All NarakUI UI Components',
    description: `Installs the NarakUI theme, utilities, shared helpers, and all ${uiItems.length} UI components.`,
    registryDependencies: [
      makeDepRef('theme', options),
      makeDepRef('utils', options),
      makeDepRef('liquid-glass', options),
      makeDepRef('highlighter', options),
      makeDepRef('use-highlighted-code', options),
      ...uiItems.map((item) => makeDepRef(item.name, options)),
    ],
  };

  return {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: 'narakui',
    homepage: options.homepage,
    items: [
      themeItem,
      utilsItem,
      liquidGlassItem,
      highlighterItem,
      useHighlightedCodeItem,
      ...uiItems,
      allItem,
    ],
  };
}

function verifyBuiltOutput(registry) {
  const builtIndexPath = path.join(OUTPUT_DIR, 'registry.json');
  if (!fs.existsSync(builtIndexPath)) {
    throw new Error(`Missing built registry index: ${path.relative(ROOT_DIR, builtIndexPath)}`);
  }

  const builtIndex = JSON.parse(fs.readFileSync(builtIndexPath, 'utf8'));
  if (!Array.isArray(builtIndex.items) || builtIndex.items.length !== registry.items.length) {
    throw new Error(
      `public/r/registry.json item count mismatch: expected ${registry.items.length}, got ${builtIndex.items?.length}`,
    );
  }

  const expectedNames = new Set(registry.items.map((item) => item.name));
  const actualJsonFiles = fs
    .readdirSync(OUTPUT_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'registry.json')
    .map((f) => f.replace(/\.json$/, ''));

  const staleFiles = actualJsonFiles.filter((name) => !expectedNames.has(name));
  if (staleFiles.length > 0) {
    throw new Error(`Stale files found in public/r/: ${staleFiles.join(', ')}`);
  }

  for (const item of registry.items) {
    const itemPath = path.join(OUTPUT_DIR, `${item.name}.json`);
    if (!fs.existsSync(itemPath)) {
      throw new Error(`Missing built registry item: public/r/${item.name}.json`);
    }

    const built = JSON.parse(fs.readFileSync(itemPath, 'utf8'));
    if (built.name !== item.name || built.type !== item.type) {
      throw new Error(`Metadata mismatch in public/r/${item.name}.json`);
    }
    if (built.$schema !== 'https://ui.shadcn.com/schema/registry-item.json') {
      throw new Error(`Unexpected $schema in public/r/${item.name}.json: ${built.$schema}`);
    }

    for (const file of built.files ?? []) {
      if (typeof file.content !== 'string' || file.content.length === 0) {
        throw new Error(`Empty file content in public/r/${item.name}.json for ${file.path}`);
      }
      if (/from\s+['"]fumadocs-/.test(file.content)) {
        throw new Error(`Fumadocs import leaked into public/r/${item.name}.json (${file.path})`);
      }
      if (/from\s+['"]@\/lib\/cn['"]/.test(file.content)) {
        throw new Error(`@/lib/cn import leaked into public/r/${item.name}.json (${file.path})`);
      }
    }
  }

  const builtTheme = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, 'theme.json'), 'utf8'));
  const themeJsonStr = JSON.stringify(builtTheme);
  if (/--fd-|#nd-docs-layout|#nd-page/.test(themeJsonStr)) {
    throw new Error('Fumadocs CSS leaked into public/r/theme.json');
  }
  if (!builtTheme.cssVars?.theme?.['color-bg-primary']) {
    throw new Error('public/r/theme.json is missing cssVars.theme.color-bg-primary');
  }
  if (!builtTheme.css?.[':root']?.['--bg-primary'] || !builtTheme.css?.['.dark']?.['--bg-primary']) {
    throw new Error('public/r/theme.json is missing :root or .dark --bg-primary tokens');
  }

  console.log(
    `✓ Verified ${registry.items.length} built registry items in public/r/ (0 Fumadocs leaks, 0 stale files)`,
  );
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const registry = buildRegistry(options);
  const serialized = `${JSON.stringify(registry, null, 2)}\n`;

  if (options.verifyOutput) {
    verifyBuiltOutput(registry);
    return;
  }

  if (options.check) {
    if (!fs.existsSync(REGISTRY_PATH)) {
      throw new Error('registry.json does not exist. Run pnpm run registry:generate.');
    }
    const existing = fs.readFileSync(REGISTRY_PATH, 'utf8');
    if (existing !== serialized) {
      throw new Error('registry.json is out of date. Run pnpm run registry:generate.');
    }
    console.log(`✓ registry.json is up to date (${registry.items.length} items)`);
    return;
  }

  fs.writeFileSync(REGISTRY_PATH, serialized, 'utf8');
  const uiCount = registry.items.filter((item) => item.type === 'registry:ui').length;
  const sharedCount = registry.items.length - uiCount;
  console.log(
    `✓ Generated registry.json (${registry.items.length} items: ${uiCount} UI components + ${sharedCount} foundation/meta items)`,
  );
}

main();
