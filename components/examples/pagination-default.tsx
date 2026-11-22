'use client';

import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export function PaginationDefaultExample() {
  const [page, setPage] = useState(3);

  return (
    <div className="w-full max-w-xl">
      <Pagination
        page={page}
        limit={10}
        offset={(page - 1) * 10}
        totalItems={248}
        onPageChange={setPage}
      />
    </div>
  );
}
