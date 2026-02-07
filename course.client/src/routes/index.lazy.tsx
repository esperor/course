import { createLazyFileRoute, useSearch } from '@tanstack/react-router';
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
      <div className="grid grid-flow-row 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-6 mt-6 mb-16">
        {data &&
          data.pages.map(
            (page) =>
              page.map((product) => (
                <ProductCard product={product} key={product.uniqueId} />
              )),
          )}
      </div>
      <div className="w-full flex">
        <LoadMoreBtn />
      </div>
    </div>
  );
}
