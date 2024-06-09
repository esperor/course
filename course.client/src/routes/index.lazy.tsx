import { createLazyFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import React from 'react';
import ProductCard from '../components/productCard';
import ProductFilters from '../components/productFilters';
import useProducts from '../hooks/useProducts';

export const Route = createLazyFileRoute('/')({
  component: Catalog,
});

function Catalog() {
  const [openedInventory, setOpenedInventory] = useState<number | null>(null);
  const {
    filters,
    setFilters,
    resetInfiniteQuery,
    data,
    error,
    status,
    queryClient,
    LoadMoreBtn
  } = useProducts();

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;
  return (
    <div className="page">
      <h1>Каталог</h1>
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onLimitChange={resetInfiniteQuery}
        onInvalidate={() =>
          queryClient.invalidateQueries({ queryKey: ['products'] })
        }
      />
      <div className="grid grid-flow-row grid-cols-4 gap-6 mt-6 mb-16">
        {data && data.pages.map(
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
        <LoadMoreBtn />
      </div>
    </div>
  );
}
