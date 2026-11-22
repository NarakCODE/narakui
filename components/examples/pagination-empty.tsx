'use client';

import { Pagination } from '@/components/ui/pagination';

export function PaginationEmptyExample() {
  return (
    <div className="w-full max-w-xl">
      <Pagination
        page={1}
        limit={10}
        offset={0}
        totalItems={0}
        onPageChange={() => {}}
      />
    </div>
  );
}
