import { InfiniteData, QueryKey, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

function useInfiniteQueryReduced<T>({
  queryFn,
  queryKey,
  limit,
}: {
  queryFn: ({ pageParam }: { pageParam: unknown }) => Promise<T[]>;
  queryKey: QueryKey
  limit: number;
}) {
  const queryClient = useQueryClient();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<T[]>(
    {
      queryKey: queryKey,
      queryFn: queryFn,
      gcTime: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length < limit) {
          return undefined;
        }
        return (lastPageParam as number) + 1;
      },
    },
    queryClient,
  );
  
  const resetInfiniteQuery = useCallback(() => {
    queryClient.setQueryData(
      queryKey,
      (data: InfiniteData<T[], unknown>) => ({
        pages: data.pages.slice(0, 1),
        pageParams: data.pageParams.slice(0, 1),
      }),
    );
  }, [queryClient, queryKey]);

  return {
    resetInfiniteQuery,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    queryClient,
    LoadMoreBtn:() => (
      <>
        <button
          type="button"
          className="btn mx-auto"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Загрузка...' : `Загрузить ещё`}
        </button>
      </>
    ),
  };
}

export default useInfiniteQueryReduced;