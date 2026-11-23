'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColorTokenSpec {
  /** Utility class or CSS variable name displayed and copied on click. */
  token: string;
  /** CSS custom property evaluated for reference. */
  cssVar: string;
  /** Light theme value from `app/design-system.css`. */
  light: string;
  /** Dark theme value from `app/design-system.css`. */
  dark: string;
  /** Preview swatch style. */
  preview?: 'fill' | 'text' | 'border' | 'shadow';
  /** Explicit CSS shadow value for light preview swatch when `preview` is `shadow`. */
  lightShadow?: string;
  /** Explicit CSS shadow value for dark preview swatch when `preview` is `shadow`. */
  darkShadow?: string;
}

export const COLOR_GROUPS: Record<string, ColorTokenSpec[]> = {
  background: [
    { token: 'bg-bg-base', cssVar: '--bg-base', light: '#ffffff', dark: '#121110' },
    { token: 'bg-bg-primary', cssVar: '--bg-primary', light: '#ffffff', dark: '#171615' },
    { token: 'bg-bg-secondary', cssVar: '--bg-secondary', light: '#fafafa', dark: '#1e1d1c' },
    { token: 'bg-bg-tertiary', cssVar: '--bg-tertiary', light: '#f5f5f5', dark: '#272625' },
    { token: 'bg-bg-quaternary', cssVar: '--bg-quaternary', light: '#e8e8e8', dark: '#31302e' },
    { token: 'bg-bg-sidebar', cssVar: '--bg-sidebar', light: '#fafafa', dark: '#121110' },
    {
      token: 'bg-bg-header',
      cssVar: '--bg-header',
      light: 'color-mix(in srgb, #ffffff 70%, transparent)',
      dark: 'color-mix(in srgb, #121110 70%, transparent)',
    },
    { token: 'bg-bg-overlay', cssVar: '--bg-overlay', light: 'rgba(0, 0, 0, 0.03)', dark: 'rgba(0, 0, 0, 0.03)' },
    { token: 'bg-bg-tooltip', cssVar: '--bg-tooltip', light: 'rgba(24, 24, 26, 0.9)', dark: 'rgba(46, 45, 43, 0.9)' },
    { token: 'bg-bg-educational-tooltip', cssVar: '--bg-educational-tooltip', light: '#3b82f6', dark: '#3b82f6' },
    { token: 'bg-bg-transparent', cssVar: '--bg-transparent', light: 'transparent', dark: 'transparent' },
    { token: 'bg-bg-blue', cssVar: '--bg-blue', light: 'oklch(97% 0.014 254.604)', dark: 'oklch(0.282 0.091 267.935 / 0.7)' },
    { token: 'bg-bg-purple', cssVar: '--bg-purple', light: 'oklch(97.7% 0.014 308.299)', dark: 'oklch(0.291 0.149 302.717 / 0.5)' },
    { token: 'bg-bg-red', cssVar: '--bg-red', light: 'oklch(97.1% 0.013 17.38)', dark: 'oklch(0.258 0.092 26.042 / 0.7)' },
    {
      token: 'bg-bg-red-hover',
      cssVar: '--bg-red-hover',
      light: 'color-mix(in oklch, oklch(63.7% 0.237 25.331) 10%, transparent)',
      dark: 'color-mix(in oklch, oklch(0.704 0.191 22.216) 10%, transparent)',
    },
    { token: 'bg-bg-green', cssVar: '--bg-green', light: 'oklch(96.861% 0.02956 154.903)', dark: 'oklch(0.266 0.065 152.934 / 0.7)' },
    {
      token: 'bg-bg-green-hover',
      cssVar: '--bg-green-hover',
      light: 'color-mix(in oklch, oklch(62.695% 0.18045 148.232) 10%, transparent)',
      dark: 'color-mix(in oklch, oklch(0.792 0.209 151.711) 10%, transparent)',
    },
    { token: 'bg-bg-orange', cssVar: '--bg-orange', light: 'oklch(98% 0.016 73.684)', dark: 'oklch(0.266 0.079 36.259 / 0.7)' },
    {
      token: 'bg-bg-orange-hover',
      cssVar: '--bg-orange-hover',
      light: 'color-mix(in oklch, oklch(70.5% 0.213 47.604) 10%, transparent)',
      dark: 'color-mix(in oklch, oklch(0.75 0.183 55.934) 10%, transparent)',
    },
    { token: 'bg-bg-amber', cssVar: '--bg-amber', light: 'oklch(98.7% 0.022 95.277)', dark: 'oklch(0.279 0.077 45.635 / 0.7)' },
    { token: 'bg-bg-cyan', cssVar: '--bg-cyan', light: 'oklch(97% 0.02 200)', dark: 'oklch(0.28 0.08 200 / 0.7)' },
    { token: 'bg-bg-pink', cssVar: '--bg-pink', light: 'oklch(97.5% 0.018 0)', dark: 'oklch(0.28 0.06 0 / 0.7)' },
    { token: '--color-dot-grid', cssVar: '--color-dot-grid', light: '#cccccc', dark: '#cccccc' },
  ],
  fill: [
    { token: 'bg-fill-primary', cssVar: '--fill-primary', light: '#18181a', dark: '#f5f4f2' },
    { token: 'bg-fill-primary-hover', cssVar: '--fill-primary-hover', light: '#2c2c2e', dark: '#ecebe9' },
    { token: 'bg-fill-secondary', cssVar: '--fill-secondary', light: '#969696', dark: '#75736f' },
    { token: 'bg-fill-tertiary', cssVar: '--fill-tertiary', light: '#d4d4d8', dark: '#5a5855' },
    { token: 'bg-fill-quaternary', cssVar: '--fill-quaternary', light: '#e8e8e8', dark: '#232221' },
    { token: 'bg-fill-quinary', cssVar: '--fill-quinary', light: '#f0f0f0', dark: '#2b2a28' },
    { token: 'bg-fill-inverse', cssVar: '--fill-inverse', light: '#ffffff', dark: '#121110' },
    { token: 'bg-fill-green', cssVar: '--fill-green', light: 'oklch(62.695% 0.18045 148.232)', dark: 'oklch(0.792 0.209 151.711)' },
    { token: 'bg-fill-red', cssVar: '--fill-red', light: 'oklch(63.7% 0.237 25.331)', dark: 'oklch(0.704 0.191 22.216)' },
    { token: 'bg-fill-blue', cssVar: '--fill-blue', light: 'oklch(62.3% 0.214 259.815)', dark: 'oklch(0.707 0.165 254.624)' },
    { token: 'bg-fill-orange', cssVar: '--fill-orange', light: 'oklch(70.5% 0.213 47.604)', dark: 'oklch(0.75 0.183 55.934)' },
    { token: 'bg-fill-orange-lightest', cssVar: '--fill-orange-lightest', light: 'oklch(98% 0.016 73.684)', dark: 'oklch(0.266 0.079 36.259 / 0.7)' },
    { token: 'bg-fill-orange-dark', cssVar: '--fill-orange-dark', light: 'oklch(47% 0.157 37.304)', dark: 'oklch(0.75 0.183 55.934)' },
    { token: 'bg-fill-amber', cssVar: '--fill-amber', light: 'oklch(76.9% 0.188 70.08)', dark: 'oklch(0.828 0.189 84.429)' },
    { token: 'bg-fill-yellow', cssVar: '--fill-yellow', light: '#f9ff57', dark: '#5e602b' },
    { token: 'bg-fill-cyan', cssVar: '--fill-cyan', light: 'oklch(70% 0.14 200)', dark: 'oklch(0.75 0.14 200)' },
    { token: 'bg-fill-pink', cssVar: '--fill-pink', light: 'oklch(74% 0.15 0)', dark: 'oklch(0.8 0.12 0)' },
  ],
  control: [
    { token: 'bg-control-bg', cssVar: '--control-bg', light: '#ffffff', dark: '#252423' },
    { token: 'bg-control-hover', cssVar: '--control-hover', light: '#f5f5f5', dark: '#31302e' },
    { token: 'bg-control-selected', cssVar: '--control-selected', light: '#f1f1f1', dark: '#383735' },
    { token: 'bg-control-primary', cssVar: '--control-primary', light: '#18181a', dark: '#f5f4f2' },
    { token: 'bg-control-primary-hover', cssVar: '--control-primary-hover', light: '#2c2c2e', dark: '#ecebe9' },
  ],
  text: [
    { token: 'text-text-primary', cssVar: '--text-primary', light: '#18181a', dark: '#ecebe9', preview: 'text' },
    { token: 'text-text-secondary', cssVar: '--text-secondary', light: '#787878', dark: '#aaa8a5', preview: 'text' },
    { token: 'text-text-tertiary', cssVar: '--text-tertiary', light: '#969696', dark: '#898784', preview: 'text' },
    { token: 'text-text-quaternary', cssVar: '--text-quaternary', light: '#b4b4b4', dark: '#676563', preview: 'text' },
    { token: 'text-text-inverse', cssVar: '--text-inverse', light: '#ffffff', dark: '#0f0e0d', preview: 'text' },
    { token: 'text-text-green', cssVar: '--text-green', light: 'oklch(62.695% 0.18045 148.232)', dark: 'oklch(0.792 0.209 151.711)', preview: 'text' },
    { token: 'text-text-red', cssVar: '--text-red', light: 'oklch(63.7% 0.237 25.331)', dark: 'oklch(0.704 0.191 22.216)', preview: 'text' },
    { token: 'text-text-blue', cssVar: '--text-blue', light: 'oklch(62.3% 0.214 259.815)', dark: 'oklch(0.707 0.165 254.624)', preview: 'text' },
    { token: 'text-text-purple', cssVar: '--text-purple', light: 'oklch(62.7% 0.265 303.9)', dark: 'oklch(0.714 0.203 305.504)', preview: 'text' },
    { token: 'text-text-orange', cssVar: '--text-orange', light: 'oklch(70.5% 0.213 47.604)', dark: 'oklch(0.75 0.183 55.934)', preview: 'text' },
    { token: 'text-text-amber', cssVar: '--text-amber', light: 'oklch(76.9% 0.188 70.08)', dark: 'oklch(0.828 0.189 84.429)', preview: 'text' },
    { token: 'text-text-cyan', cssVar: '--text-cyan', light: 'oklch(70% 0.14 200)', dark: 'oklch(0.75 0.14 200)', preview: 'text' },
    { token: 'text-text-pink', cssVar: '--text-pink', light: 'oklch(74% 0.15 0)', dark: 'oklch(0.8 0.12 0)', preview: 'text' },
    { token: 'text-text-tooltip', cssVar: '--text-tooltip', light: '#ffffff', dark: '#ecebe9', preview: 'text' },
    { token: 'text-text-tooltip-secondary', cssVar: '--text-tooltip-secondary', light: '#b4b4b4', dark: '#b4b4b4', preview: 'text' },
  ],
  border: [
    { token: 'border-border-gray', cssVar: '--border-gray', light: '#eeeeee', dark: '#2e2d2b', preview: 'border' },
    { token: 'stroke-stroke-sunburst', cssVar: '--stroke-sunburst', light: 'rgb(255, 255, 255)', dark: 'rgba(255, 255, 255, 0.4)', preview: 'border' },
    { token: 'stroke-stroke-sunburst-loading', cssVar: '--stroke-sunburst-loading', light: 'rgba(255, 255, 255, 0.8)', dark: 'rgba(255, 255, 255, 0.15)', preview: 'border' },
  ],
  palette: [
    { token: 'bg-red-base', cssVar: '--red-base', light: 'oklch(63.7% 0.237 25.331)', dark: 'oklch(0.704 0.191 22.216)' },
    { token: 'border-red-border', cssVar: '--red-border', light: 'oklch(94.5% 0.027 17.633)', dark: 'oklch(0.396 0.141 25.723 / 0.2)', preview: 'border' },
    { token: 'bg-red-muted-fill', cssVar: '--red-muted-fill', light: 'oklch(97.1% 0.013 17.38)', dark: 'oklch(0.258 0.092 26.042 / 0.7)' },
    {
      token: 'text-red-emphasis',
      cssVar: '--red-emphasis',
      light: 'oklch(44.4% 0.177 26.899)',
      dark: 'color-mix(in oklch, oklch(0.704 0.191 22.216) 90%, oklch(1 0 0))',
      preview: 'text',
    },
    { token: 'bg-blue-base', cssVar: '--blue-base', light: 'oklch(62.3% 0.214 259.815)', dark: 'oklch(0.707 0.165 254.624)' },
    { token: 'border-blue-border', cssVar: '--blue-border', light: 'oklch(94.2% 0.028 255.34)', dark: 'oklch(36% 0.14 260)', preview: 'border' },
    { token: 'bg-blue-muted-fill', cssVar: '--blue-muted-fill', light: 'oklch(97% 0.014 254.604)', dark: 'oklch(0.282 0.091 267.935 / 0.7)' },
    {
      token: 'text-blue-emphasis',
      cssVar: '--blue-emphasis',
      light: 'oklch(41.214% 0.17348 265.122)',
      dark: 'color-mix(in oklch, oklch(0.707 0.165 254.624) 90%, oklch(1 0 0))',
      preview: 'text',
    },
    { token: 'bg-green-base', cssVar: '--green-base', light: 'oklch(62.695% 0.18045 148.232)', dark: 'oklch(0.792 0.209 151.711)' },
    { token: 'border-green-border', cssVar: '--green-border', light: 'oklch(92.774% 0.06064 156.846)', dark: 'oklch(0.393 0.095 152.535 / 0.4)', preview: 'border' },
    { token: 'bg-green-muted-fill', cssVar: '--green-muted-fill', light: 'oklch(96.861% 0.02956 154.903)', dark: 'oklch(0.266 0.065 152.934 / 0.7)' },
    {
      token: 'text-green-emphasis',
      cssVar: '--green-emphasis',
      light: 'oklch(39.3% 0.095 152.535)',
      dark: 'color-mix(in oklch, oklch(0.792 0.209 151.711) 90%, oklch(1 0 0))',
      preview: 'text',
    },
    { token: 'bg-amber-base', cssVar: '--amber-base', light: 'oklch(76.9% 0.188 70.08)', dark: 'oklch(0.828 0.189 84.429)' },
    { token: 'border-amber-border', cssVar: '--amber-border', light: 'oklch(94.011% 0.05289 96.769)', dark: 'oklch(0.414 0.112 45.904 / 0.2)', preview: 'border' },
    { token: 'bg-amber-muted-fill', cssVar: '--amber-muted-fill', light: 'oklch(98.7% 0.022 95.277)', dark: 'oklch(0.279 0.077 45.635 / 0.7)' },
    {
      token: 'text-amber-emphasis',
      cssVar: '--amber-emphasis',
      light: 'oklch(47.3% 0.137 46.201)',
      dark: 'color-mix(in oklch, oklch(0.828 0.189 84.429) 90%, oklch(1 0 0))',
      preview: 'text',
    },
    { token: 'bg-purple-base', cssVar: '--purple-base', light: 'oklch(62.7% 0.265 303.9)', dark: 'oklch(0.714 0.203 305.504)' },
    { token: 'border-purple-border', cssVar: '--purple-border', light: 'oklch(93.565% 0.0325 311.625)', dark: 'oklch(0.381 0.176 304.987 / 0.4)', preview: 'border' },
    { token: 'bg-purple-muted-fill', cssVar: '--purple-muted-fill', light: 'oklch(97.7% 0.014 308.299)', dark: 'oklch(0.291 0.149 302.717 / 0.5)' },
    {
      token: 'text-purple-emphasis',
      cssVar: '--purple-emphasis',
      light: 'oklch(38.1% 0.176 304.987)',
      dark: 'color-mix(in oklch, oklch(0.714 0.203 305.504) 90%, oklch(1 0 0))',
      preview: 'text',
    },
    { token: 'bg-orange-base', cssVar: '--orange-base', light: 'oklch(70.5% 0.213 47.604)', dark: 'oklch(0.75 0.183 55.934)' },
    { token: 'border-orange-border', cssVar: '--orange-border', light: 'oklch(92.766% 0.03899 74.753)', dark: 'oklch(0.408 0.123 38.172 / 0.2)', preview: 'border' },
    { token: 'bg-orange-muted-fill', cssVar: '--orange-muted-fill', light: 'oklch(98% 0.016 73.684)', dark: 'oklch(0.266 0.079 36.259 / 0.7)' },
    {
      token: 'text-orange-emphasis',
      cssVar: '--orange-emphasis',
      light: 'oklch(47% 0.157 37.304)',
      dark: 'color-mix(in oklch, oklch(0.75 0.183 55.934) 90%, oklch(1 0 0))',
      preview: 'text',
    },
    { token: 'bg-cyan-base', cssVar: '--cyan-base', light: 'oklch(70% 0.14 200)', dark: 'oklch(0.75 0.14 200)' },
    { token: 'border-cyan-border', cssVar: '--cyan-border', light: 'oklch(92% 0.04 200)', dark: 'oklch(0.4 0.1 200 / 0.3)', preview: 'border' },
    { token: 'bg-cyan-muted-fill', cssVar: '--cyan-muted-fill', light: 'oklch(97% 0.02 200)', dark: 'oklch(0.28 0.08 200 / 0.7)' },
    {
      token: 'text-cyan-emphasis',
      cssVar: '--cyan-emphasis',
      light: 'oklch(45% 0.12 200)',
      dark: 'color-mix(in oklch, oklch(0.75 0.14 200) 90%, oklch(1 0 0))',
      preview: 'text',
    },
    { token: 'bg-pink-base', cssVar: '--pink-base', light: 'oklch(74% 0.15 0)', dark: 'oklch(0.8 0.12 0)' },
    { token: 'bg-pink-muted-fill', cssVar: '--pink-muted-fill', light: 'oklch(97.5% 0.018 0)', dark: 'oklch(0.28 0.06 0 / 0.7)' },
  ],
  chart: [
    { token: 'bg-chart-1', cssVar: '--chart-1', light: 'oklch(0.809 0.105 251.813)', dark: 'oklch(0.809 0.105 251.813)' },
    { token: 'bg-chart-2', cssVar: '--chart-2', light: 'oklch(0.623 0.214 259.815)', dark: 'oklch(0.623 0.214 259.815)' },
    { token: 'bg-chart-3', cssVar: '--chart-3', light: 'oklch(0.546 0.245 262.881)', dark: 'oklch(0.546 0.245 262.881)' },
    { token: 'bg-chart-4', cssVar: '--chart-4', light: 'oklch(0.488 0.243 264.376)', dark: 'oklch(0.488 0.243 264.376)' },
    { token: 'bg-chart-5', cssVar: '--chart-5', light: 'oklch(0.424 0.199 265.638)', dark: 'oklch(0.424 0.199 265.638)' },
    { token: '--color-chart-other', cssVar: '--color-chart-other', light: '#888888', dark: '#5b5956' },
  ],
  shadows: [
    {
      token: 'shadow-low',
      cssVar: '--shadow-low',
      light: '0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.02), 0 1px 3px 0 rgba(0,0,0,0.05)',
      dark: '0 0 0 1px rgba(214,213,212,0.12), 0 1px 3px 0 rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.02), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      darkShadow: '0 0 0 1px rgba(214, 213, 212, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-low-hover',
      cssVar: '--shadow-low-hover',
      light: '0 0 0 1px #ebebeb, 0 1px 2px 0 rgba(0,0,0,0.02), 0 1px 3px 0 rgba(0,0,0,0.05)',
      dark: '0 0 0 1px #2c2b29, 0 1px 3px 0 rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 0 0 1px #ebebeb, 0 1px 2px 0 rgba(0, 0, 0, 0.02), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      darkShadow: '0 0 0 1px #2c2b29, 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-low-focus',
      cssVar: '--shadow-low-focus',
      light: '0 0 0 1px rgba(0,0,0,0.05), 0 0 0 3px #ebebeb, 0 1px 3px 0 rgba(0,0,0,0.05)',
      dark: '0 0 0 1px rgba(214,213,212,0.12), 0 0 0 3px #2c2b29, 0 1px 3px 0 rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 0 3px #ebebeb, 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      darkShadow: '0 0 0 1px rgba(214, 213, 212, 0.12), 0 0 0 3px #2c2b29, 0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-low-borderless',
      cssVar: '--shadow-low-borderless',
      light: '0 1px 2px 0 rgba(0,0,0,0.02), 0 1px 3px 0 rgba(0,0,0,0.05)',
      dark: '0 1px 3px 0 rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02), 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      darkShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-medium',
      cssVar: '--shadow-medium',
      light: '0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.02), 0 4px 8px -2px rgba(0,0,0,0.05)',
      dark: '0 0 0 1px rgba(214,213,212,0.12), 0 4px 8px -2px rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
      darkShadow: '0 0 0 1px rgba(214, 213, 212, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-medium-hover',
      cssVar: '--shadow-medium-hover',
      light: '0 0 0 1px #ebebeb, 0 2px 4px -1px rgba(0,0,0,0.02), 0 4px 8px -2px rgba(0,0,0,0.05)',
      dark: '0 0 0 1px #2c2b29, 0 4px 8px -2px rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 0 0 1px #ebebeb, 0 2px 4px -1px rgba(0, 0, 0, 0.02), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
      darkShadow: '0 0 0 1px #2c2b29, 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-medium-focus',
      cssVar: '--shadow-medium-focus',
      light: '0 0 0 1px rgba(0,0,0,0.05), 0 0 0 3px #ebebeb, 0 4px 8px -2px rgba(0,0,0,0.05)',
      dark: '0 0 0 1px rgba(214,213,212,0.12), 0 0 0 3px #2c2b29, 0 4px 8px -2px rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 0 3px #ebebeb, 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
      darkShadow: '0 0 0 1px rgba(214, 213, 212, 0.12), 0 0 0 3px #2c2b29, 0 4px 8px -2px rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-medium-borderless',
      cssVar: '--shadow-medium-borderless',
      light: '0 2px 4px -1px rgba(0,0,0,0.02), 0 4px 8px -2px rgba(0,0,0,0.05)',
      dark: '0 4px 8px -2px rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.02), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
      darkShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-high',
      cssVar: '--shadow-high',
      light: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 8px -2px rgba(0,0,0,0.02), 0 12px 24px -4px rgba(0,0,0,0.05)',
      dark: '0 0 0 1px rgba(214,213,212,0.12), 0 12px 24px -4px rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 0 0 1px rgba(0, 0, 0, 0.05), 0 4px 8px -2px rgba(0, 0, 0, 0.02), 0 12px 24px -4px rgba(0, 0, 0, 0.05)',
      darkShadow: '0 0 0 1px rgba(214, 213, 212, 0.12), 0 12px 24px -4px rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-high-borderless',
      cssVar: '--shadow-high-borderless',
      light: '0 4px 8px -2px rgba(0,0,0,0.02), 0 12px 24px -4px rgba(0,0,0,0.05)',
      dark: '0 12px 24px -4px rgba(0,0,0,0.1)',
      preview: 'shadow',
      lightShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.02), 0 12px 24px -4px rgba(0, 0, 0, 0.05)',
      darkShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.1)',
    },
    {
      token: 'shadow-focus',
      cssVar: '--shadow-focus',
      light: '0 0 0 3px #ebebeb',
      dark: '0 0 0 3px #2c2b29',
      preview: 'shadow',
      lightShadow: '0 0 0 3px #ebebeb',
      darkShadow: '0 0 0 3px #2c2b29',
    },
  ],
  shadowColors: [
    { token: '--color-shadow-ring-1', cssVar: '--color-shadow-ring-1', light: 'rgba(0, 0, 0, 0.02)', dark: 'rgba(0, 0, 0, 0)' },
    { token: '--color-shadow-ring-2', cssVar: '--color-shadow-ring-2', light: 'rgba(0, 0, 0, 0.05)', dark: 'rgba(214, 213, 212, 0.12)' },
    { token: '--color-shadow-stroke', cssVar: '--color-shadow-stroke', light: '#ebebeb', dark: '#2c2b29' },
    { token: '--color-shadow-1', cssVar: '--color-shadow-1', light: 'rgba(0, 0, 0, 0.02)', dark: 'rgba(0, 0, 0, 0)' },
    { token: '--color-shadow-2', cssVar: '--color-shadow-2', light: 'rgba(0, 0, 0, 0.05)', dark: 'rgba(0, 0, 0, 0.1)' },
    { token: '--color-shadow-red-1', cssVar: '--color-shadow-red-1', light: 'rgba(255, 95, 87, 0.08)', dark: 'rgba(255, 95, 87, 0.15)' },
    { token: '--color-shadow-red-2', cssVar: '--color-shadow-red-2', light: 'rgba(255, 95, 87, 0.12)', dark: 'rgba(255, 95, 87, 0.25)' },
    { token: '--color-shadow-red-3', cssVar: '--color-shadow-red-3', light: 'rgba(255, 95, 87, 0.2)', dark: 'rgba(255, 95, 87, 0.3)' },
  ],
  workflow: [
    { token: 'bg-workflow-bg-base', cssVar: '--workflow-bg-base', light: 'rgb(247, 247, 247)', dark: 'rgb(18, 17, 16)' },
    { token: 'bg-workflow-fill-green', cssVar: '--workflow-fill-green', light: 'rgb(78, 168, 82)', dark: 'rgb(95, 207, 100)' },
    { token: 'bg-workflow-fill-green-faint', cssVar: '--workflow-fill-green-faint', light: '#4ea8521a', dark: '#5fcf641a' },
    { token: 'bg-workflow-fill-blue', cssVar: '--workflow-fill-blue', light: 'rgb(72, 148, 238)', dark: 'rgb(93, 171, 255)' },
    { token: 'bg-workflow-fill-blue-faint', cssVar: '--workflow-fill-blue-faint', light: '#4894ee1a', dark: '#5dabff1a' },
    { token: 'bg-workflow-fill-purple', cssVar: '--workflow-fill-purple', light: 'rgb(141, 88, 247)', dark: 'rgb(147, 93, 255)' },
    { token: 'bg-workflow-fill-purple-faint', cssVar: '--workflow-fill-purple-faint', light: '#8d58f71a', dark: '#935dff1a' },
    { token: 'bg-workflow-fill-orange', cssVar: '--workflow-fill-orange', light: 'rgb(255, 159, 79)', dark: 'rgb(255, 135, 99)' },
    { token: 'bg-workflow-fill-orange-faint', cssVar: '--workflow-fill-orange-faint', light: 'rgb(255, 159, 79, 0.16)', dark: '#ff87631a' },
    { token: 'bg-workflow-fill-pink', cssVar: '--workflow-fill-pink', light: 'rgb(248, 82, 145)', dark: 'rgb(255, 101, 159)' },
    { token: 'bg-workflow-fill-pink-faint', cssVar: '--workflow-fill-pink-faint', light: '#f852911a', dark: '#ff659f1a' },
    { token: 'bg-workflow-fill-red', cssVar: '--workflow-fill-red', light: 'oklch(63.7% 0.237 25.331)', dark: 'oklch(0.704 0.191 22.216)' },
    {
      token: 'bg-workflow-fill-red-faint',
      cssVar: '--workflow-fill-red-faint',
      light: 'color-mix(in srgb, oklch(63.7% 0.237 25.331) 10%, transparent)',
      dark: 'color-mix(in srgb, oklch(0.704 0.191 22.216) 10%, transparent)',
    },
  ],
};

export type ColorGroupKey = keyof typeof COLOR_GROUPS;

interface SwatchColumnProps {
  mode: 'light' | 'dark';
  item: ColorTokenSpec;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

/** Renders either the Light or Dark swatch + 2-line metadata stack inside a token row. */
function SwatchColumn({ mode, item, copiedKey, onCopy }: SwatchColumnProps) {
  const isLight = mode === 'light';
  const valueText = isLight ? item.light : item.dark;
  const copyId = `${item.token}:${mode}`;
  const isCopied = copiedKey === copyId;

  const isDarkBackedText =
    item.token === 'text-text-inverse' ||
    item.token === 'text-text-tooltip' ||
    item.token === 'text-text-tooltip-secondary';

  const textBackdrop = isLight
    ? isDarkBackedText
      ? '#18181a'
      : '#ffffff'
    : item.token === 'text-text-inverse'
      ? '#f5f4f2'
      : '#171615';

  const modeBorderClass = isLight
    ? 'border border-black/10'
    : 'border border-white/15';

  let swatchNode: React.ReactNode;

  if (item.preview === 'shadow') {
    const shadowValue = isLight ? item.lightShadow : item.darkShadow;
    swatchNode = (
      <div
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-[8px]',
          modeBorderClass,
        )}
        style={{ backgroundColor: isLight ? '#fafafa' : '#121110' }}
      >
        <div
          className="size-7 rounded-[6px]"
          style={{
            backgroundColor: isLight ? '#ffffff' : '#171615',
            boxShadow: shadowValue,
          }}
        />
      </div>
    );
  } else if (item.preview === 'text') {
    swatchNode = (
      <div
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-[8px]',
          modeBorderClass,
        )}
        style={{ backgroundColor: textBackdrop }}
      >
        <span className="text-body-regular-semibold" style={{ color: valueText }}>
          Aa
        </span>
      </div>
    );
  } else if (item.preview === 'border') {
    swatchNode = (
      <div
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-[8px] p-1.5',
          modeBorderClass,
        )}
        style={{ backgroundColor: isLight ? '#ffffff' : '#171615' }}
      >
        <div
          className="size-full rounded-[5px]"
          style={{ border: `2px solid ${valueText}` }}
        />
      </div>
    );
  } else {
    swatchNode = (
      <div
        className={cn(
          'relative size-12 shrink-0 overflow-hidden rounded-[8px]',
          modeBorderClass,
        )}
        style={{
          backgroundColor: isLight ? '#ffffff' : '#171615',
          backgroundImage: isLight
            ? 'linear-gradient(45deg, #f2f2f2 25%, transparent 25%), linear-gradient(-45deg, #f2f2f2 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f2f2f2 75%), linear-gradient(-45deg, transparent 75%, #f2f2f2 75%)'
            : 'linear-gradient(45deg, #242321 25%, transparent 25%), linear-gradient(-45deg, #242321 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #242321 75%), linear-gradient(-45deg, transparent 75%, #242321 75%)',
          backgroundSize: '10px 10px',
          backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: valueText }} />
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-1 items-center gap-3">
      {swatchNode}
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="text-body-mini-medium uppercase text-text-secondary">
          {isLight ? 'Light' : 'Dark'}
        </div>
        <div className="flex min-w-0 items-center gap-1 text-body-small-regular text-text-secondary">
          <span className="min-w-0 break-all font-mono text-[12px] leading-4 text-text-secondary">
            {valueText}
          </span>
          <button
            type="button"
            aria-label={`Copy ${valueText}`}
            onClick={() => onCopy(valueText, copyId)}
            className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 hover:bg-control-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isCopied ? (
              <Check aria-hidden="true" className="size-3.5 text-text-green" />
            ) : (
              <Copy aria-hidden="true" className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Bounded vertical token stack displaying Light and Dark swatches side-by-side per row. */
export function ColorGroup({ group }: { group: ColorGroupKey }) {
  const tokens = COLOR_GROUPS[group];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedKey(key);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedKey(null), 1600);
  };

  return (
    <div className="not-prose my-4 grid grid-cols-1 divide-y divide-border-gray overflow-hidden rounded-xl border border-border-gray bg-bg-primary dark:bg-bg-secondary">
      {tokens.map((item) => {
        const headerCopyKey = `${item.token}:token`;
        const isHeaderCopied = copiedKey === headerCopyKey;

        return (
          <div key={item.token} className="flex flex-col gap-6 p-6 md:p-8">
            <div className="flex items-center gap-1.5 text-body-small-regular text-text-secondary">
              <code className="font-mono text-text-primary">{item.token}</code>
              <button
                type="button"
                aria-label={`Copy ${item.token}`}
                onClick={() => handleCopy(item.token, headerCopyKey)}
                className="inline-flex size-6 cursor-pointer items-center justify-center rounded-sm text-text-tertiary transition-colors duration-150 hover:bg-control-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isHeaderCopied ? (
                  <Check aria-hidden="true" className="size-3.5 text-text-green" />
                ) : (
                  <Copy aria-hidden="true" className="size-3.5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SwatchColumn
                mode="light"
                item={item}
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
              <SwatchColumn
                mode="dark"
                item={item}
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
