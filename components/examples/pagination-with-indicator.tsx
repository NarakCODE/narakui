'use client';

import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export function PaginationWithIndicatorExample() {
  const [page, setPage] = useState(1);

  return (
    <div className="w-full max-w-xl">
      <Pagination
        page={page}
        limit={10}
        offset={(page - 1) * 10}
        totalItems={50}
        onPageChange={setPage}
        showPageIndicatorBetweenArrows
      />
    </div>
  );
}
