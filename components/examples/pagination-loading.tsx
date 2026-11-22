'use client';

import { Pagination } from '@/components/ui/pagination';

export function PaginationLoadingExample() {
  return (
    <div className="w-full max-w-xl">
      <Pagination
        page={2}
        limit={10}
        offset={10}
        totalItems={248}
        onPageChange={() => {}}
        isLoading
      />
    </div>
  );
}
