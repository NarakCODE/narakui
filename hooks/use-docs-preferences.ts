'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type InstallationType = 'cli' | 'prompt' | 'manual';
export type PackageManager = 'pnpm' | 'yarn' | 'npm' | 'bun';

export interface DocsConfig {
  installationType: InstallationType;
}

const CONFIG_STORAGE_KEY = 'rakfound_docs_config_v1';
const PM_STORAGE_KEY = 'rakfound_docs_package_manager';

const DEFAULT_CONFIG: DocsConfig = {
  installationType: 'cli',
};

const DEFAULT_PACKAGE_MANAGER: PackageManager = 'pnpm';

type Listener = () => void;

const configListeners = new Set<Listener>();
let configSnapshot: DocsConfig = DEFAULT_CONFIG;
let configHydrated = false;

const pmListeners = new Set<Listener>();
let pmSnapshot: PackageManager = DEFAULT_PACKAGE_MANAGER;
let pmHydrated = false;

function isValidInstallationType(value: unknown): value is InstallationType {
  return value === 'cli' || value === 'prompt' || value === 'manual';
}

function isValidPackageManager(value: unknown): value is PackageManager {
  return value === 'pnpm' || value === 'yarn' || value === 'npm' || value === 'bun';
}

function hydrateConfigFromStorage() {
  if (configHydrated || typeof window === 'undefined') return;
  configHydrated = true;
  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<DocsConfig>;
    if (isValidInstallationType(parsed?.installationType)) {
      configSnapshot = { installationType: parsed.installationType };
      configListeners.forEach((listener) => listener());
    }
  } catch {
    // Ignore storage read errors in restricted environments.
  }
}

function hydratePackageManagerFromStorage() {
  if (pmHydrated || typeof window === 'undefined') return;
  pmHydrated = true;
  try {
    const raw = window.localStorage.getItem(PM_STORAGE_KEY);
    if (!raw) return;
    const unquoted = raw.replace(/^"|"$/g, '');
    if (isValidPackageManager(unquoted)) {
      pmSnapshot = unquoted;
      pmListeners.forEach((listener) => listener());
    }
  } catch {
    // Ignore storage read errors in restricted environments.
  }
}

function subscribeConfig(listener: Listener) {
  configListeners.add(listener);
  return () => {
    configListeners.delete(listener);
  };
}

function subscribePackageManager(listener: Listener) {
  pmListeners.add(listener);
  return () => {
    pmListeners.delete(listener);
  };
}

function getConfigSnapshot() {
  return configSnapshot;
}

function getConfigServerSnapshot() {
  return DEFAULT_CONFIG;
}

function getPmSnapshot() {
  return pmSnapshot;
}

function getPmServerSnapshot() {
  return DEFAULT_PACKAGE_MANAGER;
}

/** Shared, `localStorage`-persisted docs installation tab preference (`cli` | `prompt` | `manual`). */
export function useConfig(): [
  DocsConfig,
  (updater: DocsConfig | ((prev: DocsConfig) => DocsConfig)) => void,
] {
  const value = useSyncExternalStore(
    subscribeConfig,
    getConfigSnapshot,
    getConfigServerSnapshot,
  );

  useEffect(() => {
    hydrateConfigFromStorage();
  }, []);

  const setConfig = useCallback(
    (updater: DocsConfig | ((prev: DocsConfig) => DocsConfig)) => {
      const next = typeof updater === 'function' ? updater(configSnapshot) : updater;
      if (next.installationType === configSnapshot.installationType) return;
      configSnapshot = next;
      try {
        window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage write errors.
      }
      configListeners.forEach((listener) => listener());
    },
    [],
  );

  return [value, setConfig];
}

/** Shared, `localStorage`-persisted package manager preference (`pnpm` | `yarn` | `npm` | `bun`). */
export function usePackageManager(): [
  PackageManager,
  (next: PackageManager) => void,
] {
  const value = useSyncExternalStore(
    subscribePackageManager,
    getPmSnapshot,
    getPmServerSnapshot,
  );

  useEffect(() => {
    hydratePackageManagerFromStorage();
  }, []);

  const setPackageManager = useCallback((next: PackageManager) => {
    if (!isValidPackageManager(next) || next === pmSnapshot) return;
    pmSnapshot = next;
    try {
      window.localStorage.setItem(PM_STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors.
    }
    pmListeners.forEach((listener) => listener());
  }, []);

  return [value, setPackageManager];
}
