'use client';

import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export function PaginationArrowsOnlyExample() {
  const [page, setPage] = useState(5);

  return (
    <div className="w-full max-w-xl">
      <Pagination
        page={page}
        limit={10}
        offset={(page - 1) * 10}
        totalItems={200}
        onPageChange={setPage}
        showOnlyArrows
      />
    </div>
  );
}
