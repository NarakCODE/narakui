'use client';

import { useState } from 'react';
import { Pagination } from '@/components/ui/pagination';

export function PaginationCursorExample() {
  const [page, setPage] = useState(1);

  return (
    <div className="w-full max-w-xl">
      <Pagination
        mode="cursor"
        page={page}
        hasNextPage={page < 4}
        onPageChange={setPage}
      />
    </div>
  );
}
