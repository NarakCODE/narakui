export interface NpmCommandSet {
  pnpm: string;
  yarn: string;
  npm: string;
  bun: string;
}

/** Converts a single-line npm / npx / pnpm / yarn / bun command into all four package manager equivalents. */
export function parseNpmCommands(rawCommand: string): NpmCommandSet | null {
  const trimmed = rawCommand.trim();
  if (!trimmed || trimmed.includes('\n')) return null;

  if (/^npm\s+(?:install|i)\s+/.test(trimmed)) {
    const args = trimmed.replace(/^npm\s+(?:install|i)\s+/, '');
    return {
      pnpm: `pnpm add ${args}`,
      yarn: `yarn add ${args}`,
      npm: `npm install ${args}`,
      bun: `bun add ${args}`,
    };
  }

  if (trimmed.startsWith('npx create-')) {
    const rest = trimmed.slice('npx create-'.length);
    return {
      pnpm: `pnpm create ${rest}`,
      yarn: `yarn create ${rest}`,
      npm: `npx create-${rest}`,
      bun: `bunx --bun create-${rest}`,
    };
  }

  if (trimmed.startsWith('npm create ')) {
    const rest = trimmed.slice('npm create '.length);
    return {
      pnpm: `pnpm create ${rest}`,
      yarn: `yarn create ${rest}`,
      npm: `npm create ${rest}`,
      bun: `bun create ${rest}`,
    };
  }

  if (trimmed.startsWith('npx ')) {
    const rest = trimmed.slice('npx '.length);
    return {
      pnpm: `pnpm dlx ${rest}`,
      yarn: `yarn dlx ${rest}`,
      npm: `npx ${rest}`,
      bun: `bunx --bun ${rest}`,
    };
  }

  if (trimmed.startsWith('pnpm dlx ')) {
    const rest = trimmed.slice('pnpm dlx '.length);
    return {
      pnpm: `pnpm dlx ${rest}`,
      yarn: `yarn dlx ${rest}`,
      npm: `npx ${rest}`,
      bun: `bunx --bun ${rest}`,
    };
  }

  if (trimmed.startsWith('pnpm add ')) {
    const rest = trimmed.slice('pnpm add '.length);
    return {
      pnpm: `pnpm add ${rest}`,
      yarn: `yarn add ${rest}`,
      npm: `npm install ${rest}`,
      bun: `bun add ${rest}`,
    };
  }

  if (trimmed.startsWith('npm run ')) {
    const rest = trimmed.slice('npm run '.length);
    return {
      pnpm: `pnpm ${rest}`,
      yarn: `yarn ${rest}`,
      npm: `npm run ${rest}`,
      bun: `bun ${rest}`,
    };
  }

  return null;
}
