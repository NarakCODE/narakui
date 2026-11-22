import { createCn } from 'cn/config';

export type { ClassValue } from 'cn';

/**
 * Merges conditional class names and resolves Tailwind utility conflicts,
 * configured with Rakfound's custom typography, gradient, and shadow tokens.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'title-regular',
            'title-small-regular',
            'title-small-medium',
            'title-small-semibold',
            'title-mini-regular',
            'title-mini-medium',
            'title-mini-semibold',
            'body-regular',
            'body-regular-medium',
            'body-regular-semibold',
            'body-regular-spaced',
            'body-small-regular',
            'body-small-medium',
            'body-small-semibold',
            'body-small-spaced',
            'body-mini-regular',
            'body-mini-medium',
            'body-micro-regular',
            'body-micro-medium',
            'paragraph-regular',
            'paragraph-small',
            'paragraph-small-relaxed',
          ],
        },
      ],
      'bg-image': [
        {
          bg: ['button-primary', 'button-pos-action'],
        },
      ],
      shadow: [
        {
          shadow: [
            'low',
            'low-hover',
            'low-focus',
            'low-borderless',
            'medium',
            'medium-hover',
            'medium-focus',
            'medium-borderless',
            'high',
            'high-borderless',
            'focus',
            'button-primary',
            'button-pos-action',
            'button-secondary',
          ],
        },
      ],
    },
  },
});
