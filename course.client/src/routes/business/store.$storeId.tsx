import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { authenticate } from '../../utils/http';
import useProducts from '../../hooks/useProducts';
import { useMemo } from 'react';
import ProductCard from '../../components/productCard';
import ProductFilters from '../../components/productFilters';

export const Route = createFileRoute('/business/store/$storeId')({
  component: BusinessStore,
  beforeLoad: authenticate,
});

function BusinessStore() {
  const searchParams = useSearch({ from: '/business/store/$storeId' });
  const pathParams = Route.useParams();
  const productsSearchParams = useMemo(
    () => ({ ...searchParams, storeId: parseInt(pathParams.storeId) }),
    [pathParams.storeId, searchParams],
  );
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
        <Link
          from='/business/store/$storeId'
          to='/business/product/new'
          search={{ storeId: Number(pathParams.storeId) }}
          className="flex border border-slate-500 px-4 py-3 rounded-md relative text-transparent"
          title="Добавить новый товар"
        >
          +
          <div className="bg-slate-200 w-[0.15rem] h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="bg-slate-200 w-[0.15rem] h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
        </Link>
        {data &&
          data.pages.map(
            (page) =>
              page &&
              page.map((product) => (
                <ProductCard product={product} key={product.uniqueId} />
              )),
          )}
          {data && data.pages.flat().length == 0 && <div className='self-center'>Ничего не нашлось</div>}
      </div>
      <div className="w-full flex">
        <LoadMoreBtn />
      </div>
    </div>
  );
}
