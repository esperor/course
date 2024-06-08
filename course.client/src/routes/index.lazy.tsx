import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import ProductRecord from '../models/productRecord';
import axios from 'axios';
import api from '../api';
import { useState } from 'react';
import EProductOrdering, {
  productOrderingMap,
} from '../models/productOrdering';
import React from 'react';
import ProductCard from '../components/productCard';
import Reset from '../components/assets/reset';

export const Route = createLazyFileRoute('/')({
  component: Catalog,
});

const defaultLimit = 10;

function Catalog() {
  const [limit, setLimit] = useState(defaultLimit);
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
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<ProductRecord[]>(
    {
      queryKey: ['products'],
      queryFn: fetchProducts,
      gcTime: defaultLimit * 60 * 1000,
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

  const resetInfiniteQuery = () => {
    queryClient.setQueryData(
      ['products'],
      (data: InfiniteData<ProductRecord[], unknown>) => ({
        pages: data.pages.slice(0, 1),
        pageParams: data.pageParams.slice(0, 1),
      }),
    );
  };

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error.message}</div>;
  return (
    <div className="page">
      <h1>Каталог</h1>
      <div className="flex flex-row items-center">
        <label className="mr-4" htmlFor="search">
          Поиск:
        </label>
        <input
          type="text"
          className="w-64 h-fit"
          id="search"
          value={search ?? ''}
          placeholder="Рубашка мужская..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="mr-4 ml-12" htmlFor="sort">
          Сортировать:
        </label>
        <select
          className="text-gray-900 h-fit"
          id="sort"
          value={ordering as number}
          onChange={(e) =>
            setOrdering(parseInt(e.target.value) as EProductOrdering)
          }
        >
          {Object.entries(productOrderingMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <button
          className="ml-auto h-fit btn px-0 bg-transparent"
          onClick={() => {
            setOrdering(EProductOrdering.None);
            setSearch(null);
            setTimeout(
              () => queryClient.invalidateQueries({ queryKey: ['products'] }),
              50,
            );
          }}
        >
          <Reset />
        </button>
        <button
          type="button"
          className="btn ml-4"
          title="Применить фильтры"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            resetInfiniteQuery();
          }}
        >
          Применить
        </button>
      </div>
      <div className="flex flex-row gap-4 mt-4 items-center">
        <label htmlFor="limit" className="mr-4">
          Показывать товаров:
        </label>
        <input
          type="number"
          className="w-16 h-fit"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          onBlur={() =>
            setTimeout(
              () => queryClient.invalidateQueries({ queryKey: ['products'] }),
              50,
            )
          }
        />
        <button
          className="btn p-0 bg-transparent"
          title="Сбросить количество показываемых товаров"
          onClick={() => {
            setLimit(defaultLimit);
            setTimeout(
              () => queryClient.invalidateQueries({ queryKey: ['products'] }),
              50,
            );
          }}
        >
          <Reset />
        </button>
      </div>
      <div className="grid grid-flow-row grid-cols-4 gap-6 mt-6 mb-16">
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
      <div className="w-full flex">
        <button
          type="button"
          className="btn mx-auto"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Загрузка...' : `Загрузить ещё`}
        </button>
      </div>
    </div>
  );
}
