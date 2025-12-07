import { createLazyFileRoute, useSearch } from '@tanstack/react-router';
import React from 'react';
import ProductCard from '../components/productCard';
import ProductFilters from '../components/productFilters';
import useProducts from '../hooks/useProducts';

export const Route = createLazyFileRoute('/')({
  component: Catalog,
});

function Catalog() {
  const searchParams = useSearch({ from: '/' });
  const {
    filters,
    setFilters,
    resetInfiniteQuery,
    data,
    error,
    status,
    queryClient,
    LoadMoreBtn,
  } = useProducts(searchParams);

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;
  return (
    <div className="page">
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onLimitChange={resetInfiniteQuery}
        onInvalidate={() =>
          queryClient.invalidateQueries({ queryKey: ['products'] })
        }
      />
      <div className="grid grid-flow-row grid-cols-4 gap-6 mt-6 mb-16">
        {data &&
          data.pages.map(
            (page) =>
              page && (
                <React.Fragment key={page.at(0)?.id}>
                  {page.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))}
                </React.Fragment>
              ),
          )}
      </div>
      <div className="w-full flex">
        <LoadMoreBtn />
      </div>
    </div>
  );
}
