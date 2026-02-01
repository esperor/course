import { createFileRoute, useSearch } from '@tanstack/react-router'
import { authenticate } from '../../utils/http'
import useProducts from '../../hooks/useProducts';
import React, { useEffect, useMemo } from 'react';
import ProductCard from '../../components/productCard';
import ProductFilters from '../../components/productFilters';

export const Route = createFileRoute('/business/store/$storeId')({
  component: BusinessStore,
  beforeLoad: authenticate,
})

function BusinessStore() {
  const searchParams = useSearch({ from: '/business/store/$storeId' });
  const pathParams = Route.useParams();
  const productsSearchParams = useMemo(() => ({ ...searchParams, storeId: parseInt(pathParams.storeId) }), [pathParams.storeId, searchParams]);
  const {
    filters,
    setFilters,
    resetInfiniteQuery,
    data,
    error,
    status,
    queryClient,
    LoadMoreBtn,
  } = useProducts(productsSearchParams);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }, [queryClient]);

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
      <div className="grid grid-flow-row 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-6 mt-6 mb-16">
        {data &&
          data.pages.map(
            (page) =>
              page && (
                <React.Fragment key={JSON.stringify(page)}>
                  {page.map((product) => (
                    <ProductCard product={product} key={product.record.id ?? product.id} />
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
