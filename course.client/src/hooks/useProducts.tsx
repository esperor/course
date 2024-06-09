import { useState } from 'react';
import ProductFiltersModel from '../models/productFiltersModel';
import axios from 'axios';
import api from '../api';
import EProductOrdering from '../models/productOrdering';
import constant from '../utils/constants';
import {
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query';
import ProductRecord from '../models/productRecord';

const useProducts = () => {
  const [filters, setFilters] = useState<ProductFiltersModel>({
    limit: constant.defaultLimit,
    ordering: EProductOrdering.None,
    search: null,
  });

  const fetchProducts = async ({ pageParam }: { pageParam: unknown }) => {
    let url = `${api.product.rest}?offset=${(pageParam as number) * filters.limit}&limit=${filters.limit}`;
    if (filters.search != null) url += `&searchString=${filters.search}`;
    if (filters.ordering != EProductOrdering.None)
      url += `&orderBy=${filters.ordering}`;
    const res = await axios.get(url);
    return res.data;
  };

  const queryClient = useQueryClient();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<ProductRecord[]>(
    {
      queryKey: ['products'],
      queryFn: fetchProducts,
      gcTime: 10 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      initialPageParam: 0,
      getNextPageParam: (lastPage, _, lastPageParam) => {
        if (lastPage.length < filters.limit) {
          return undefined;
        }
        return (lastPageParam as number) + 1;
      },
    },
    queryClient,
  );

  const resetInfiniteQuery = () => {
    queryClient.setQueryData(
      ['products'],
      (data: InfiniteData<ProductRecord[], unknown>) => ({
        pages: data.pages.slice(0, 1),
        pageParams: data.pageParams.slice(0, 1),
      }),
    );
  };

  return {
    filters,
    setFilters,
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
};

export default useProducts;
