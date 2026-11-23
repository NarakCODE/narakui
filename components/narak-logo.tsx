import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { appName } from '@/lib/shared';

const BRAND_MARK_PATH =
  'M2.7697 20.3216C1.6618 19.5259 0.7637 17.7750 0.7637 16.4109L0.7637 9.6015C0.7637 8.2374 1.6618 6.4866 2.7697 5.6908L8.6899 1.4389C9.7978 0.6432 11.3020 0.9232 12.0494 2.0642L19.2206 13.0110C19.2688 13.0846 19.3079 13.0730 19.3079 12.9850L19.3079 3.7939C19.3079 3.7059 19.3659 3.6761 19.4373 3.7275L24.9961 7.7198C26.1041 8.5156 27.0022 10.2664 27.0022 11.6305L27.0022 18.4399C27.0022 19.8040 26.1041 21.5549 24.9961 22.3506L19.0760 26.6025C17.9680 27.3982 16.4639 27.1183 15.7164 25.9772L8.5453 15.0304C8.4971 14.9568 8.4580 14.9685 8.4580 15.0565L8.4580 24.2476C8.4580 24.3356 8.4000 24.3653 8.3285 24.3139Z';

/** Renders the adaptive NarakUI brand mark. */
export function NarakUIMark({ className, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn('shrink-0', className)}
      {...props}
    >
      <path d={BRAND_MARK_PATH} fill="currentColor" />
    </svg>
  );
}

/** Renders the inline NarakUI mark and Geist Rounded wordmark. */
export function NarakUILogo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <NarakUIMark className="h-[22px] w-auto" />
      <span className="font-brand text-[18px] font-semibold tracking-[-0.025em] leading-none">
        {appName}
      </span>
    </span>
  );
}
