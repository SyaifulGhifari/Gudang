import { useState, useCallback } from 'react';

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

/**
 * Hook untuk handle pagination logic
 */
export function usePagination(defaultPage = 1, defaultLimit = 20) {
  const [page, setPage] = useState(defaultPage);
  const [limit, setLimit] = useState(defaultLimit);

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage));
  }, []);

  const nextPage = useCallback(() => {
    setPage(p => p + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const setPageSize = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset ke page 1 saat ganti limit
  }, []);

  const resetPagination = useCallback(() => {
    setPage(defaultPage);
    setLimit(defaultLimit);
  }, [defaultPage, defaultLimit]);

  return {
    page,
    limit,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    resetPagination,
  };
}

/**
 * Hook untuk handle pagination state dengan total
 */
export function usePaginationState(defaultPage = 1, defaultLimit = 20) {
  const [state, setState] = useState<PaginationState>({
    page: defaultPage,
    limit: defaultLimit,
    total: 0,
  });

  const goToPage = useCallback((newPage: number) => {
    setState(s => ({ ...s, page: Math.max(1, newPage) }));
  }, []);

  const nextPage = useCallback(() => {
    setState(s => {
      const maxPage = Math.ceil(s.total / s.limit);
      return { ...s, page: Math.min(s.page + 1, maxPage) };
    });
  }, []);

  const prevPage = useCallback(() => {
    setState(s => ({ ...s, page: Math.max(1, s.page - 1) }));
  }, []);

  const setPageSize = useCallback((newLimit: number) => {
    setState(s => ({ ...s, limit: newLimit, page: 1 }));
  }, []);

  const setTotal = useCallback((total: number) => {
    setState(s => ({ ...s, total }));
  }, []);

  const totalPages = Math.ceil(state.total / state.limit);

  return {
    ...state,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    setTotal,
    hasNextPage: state.page < totalPages,
    hasPrevPage: state.page > 1,
  };
}
