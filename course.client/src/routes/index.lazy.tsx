import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import ProductRecord from '../models/productRecord';
import axios from 'axios';
import api from '../api';
import { useState } from 'react';
import EProductOrdering from '../models/productOrdering';
import React from 'react';
import ProductCard from '../components/productCard';

export const Route = createLazyFileRoute('/')({
  component: Catalog,
});

function Catalog() {
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState<string | null>(null);
  const [ordering, setOrdering] = useState<EProductOrdering>(
    EProductOrdering.None,
  );

  const fetchProducts = async ({ pageParam }: { pageParam: unknown }) => {
    let url = `${api.product.rest}?offset=${(pageParam as number) * limit}&limit=${limit}`;
    if (search != null) url += `&searchString=${search}`;
    if (ordering != EProductOrdering.None) url += `&orderBy=${ordering}`;
    const res = await axios.get(url);
    return res.data;
  };

  const [openedInventory, setOpenedInventory] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
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
        if (lastPage.length === 0) {
          return 0;
        }
        return (lastPageParam as number) + 1;
      },
    },
    queryClient,
  );

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error.message}</div>;
  return (
    <div className="page">
      <h1>Каталог</h1>
      <div className="grid grid-flow-row grid-cols-4 gap-6 mt-6">
        {data.pages.map(
          (page) =>
            page && (
              <React.Fragment key={page.at(0)?.id}>
                {page.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    setOpenedInventory={setOpenedInventory}
                    openedInventory={openedInventory}
                  />
                ))}
              </React.Fragment>
            ),
        )}
      </div>
    </div>
  );
}
