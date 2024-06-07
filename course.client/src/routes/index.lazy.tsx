import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { createLazyFileRoute } from '@tanstack/react-router';
import ProductRecord from '../models/productRecord';
import axios from 'axios';
import api from '../api';
import { useState } from 'react';
import EProductOrdering from '../models/productOrdering';
import React from 'react';
import ProductCounter from '../components/productCounter';
import randomStock from '../utils/randomStock';

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
                {page.map((product) => {
                  const productPresent: boolean =
                    (product.records && product.records.length > 0) || false;
                  return (
                    <div
                      className={`flex flex-col rounded-lg bg-slate-900 p-4 relative
                        ${!productPresent && 'bg-gray-700'} 
                        ${openedInventory == product.id && 'rounded-b-none'}`}
                      key={product.id}
                    >
                      <img
                        className={`absolute inset-0 w-full h-[50%] rounded-t-lg object-cover z-[0] ${productPresent ? '' : 'opacity-50'}`}
                        src={
                          product.records && product.records.at(0)?.image
                            ? `data:image/*;base64,${product.records.at(0)?.image}`
                            : `/stock/${randomStock()}.jpg`
                        }
                        alt={product.title}
                      />
                      <h3 className="z-[1] relative mt-[50%]">
                        {product.title}
                      </h3>
                      <h4 className="z-[1] relative">{product.description}</h4>
                      {productPresent ? (
                        <p>{`От ${product.records!.reduce((acc, record) => Math.min(acc, record.price), Infinity)} руб.`}</p>
                      ) : (
                        <p>Нет в наличии</p>
                      )}
                      {openedInventory !== product.id ? (
                        <button
                          type="button"
                          className="btn ml-auto"
                          disabled={!productPresent}
                          onClick={() => setOpenedInventory(product.id)}
                        >
                          Купить
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="ml-auto w-8 h-8 active:scale-90 scale-100"
                          onClick={() => setOpenedInventory(null)}
                        >
                          <div className="h-[1px] w-[80%] mx-auto bg-slate-200 rotate-45 origin-center"></div>
                          <div className="h-[1px] w-[80%] mx-auto bg-slate-200 -rotate-45 origin-center"></div>
                        </button>
                      )}

                      {openedInventory == product.id && (
                        <div className="absolute p-4 pt-0 h-fit w-full left-0 top-[100%] flex flex-col bg-slate-900 rounded-b-lg">
                          {product.records &&
                            product.records.length > 0 &&
                            product.records.map((record) => (
                              <div className="flex flex-row" key={record.id}>
                                <p>{`Размер: ${record.size} - ${record.price} руб.`}</p>
                                <ProductCounter
                                  recordId={record.id}
                                  productId={product.id}
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ),
        )}
      </div>
    </div>
  );
}
