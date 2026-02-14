import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { authenticateSeller } from '../../utils/http';
import useProducts from '../../hooks/useProducts';
import { useMemo, useState } from 'react';
import ProductFilters from '../../components/productFilters';
import { useQuery } from '@tanstack/react-query';
import StoreInfo from '../../models/server/requests/storeInfo';
import axios from 'axios';
import api from '../../api';
import Row from '../../components/routes/business/store.storeId/row';
import EProductOrdering from '../../models/productOrdering';

export const Route = createFileRoute('/business/store/$storeId')({
  component: BusinessStore,
  beforeLoad: authenticateSeller,
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
  const storesQuery = useQuery<StoreInfo[]>(
    {
      queryKey: ['business-stores'],
      queryFn: async () => {
        const res = await axios.get(`/${api.business.store.getAll}`);
        return res.data;
      },
    },
    queryClient,
  );
  const [selectedProductUniqueId, setSelectedProductUniqueId] = useState<string | null>(null);

  const orderingDivStyles = 'w-0 border-l-[0.5rem] border-l-transparent border-r-[0.5rem] border-r-transparent';
  let priceOrderingDivStyles = orderingDivStyles;
  if (filters.ordering == EProductOrdering.PriceAsc) {
    priceOrderingDivStyles += ' border-b-[0.625rem] border-b-slate-100';
  } else if (filters.ordering == EProductOrdering.PriceDesc) {
    priceOrderingDivStyles += ' border-t-[0.625rem] border-t-slate-100';
  } else {
    priceOrderingDivStyles += ' !border-0 w-[0.625rem] aspect-square rounded-full bg-slate-400 opacity-70';
  }

  let titleOrderingDivStyles = orderingDivStyles;
  if (filters.ordering == EProductOrdering.TitleAsc) {
    titleOrderingDivStyles += ' border-b-[0.625rem] border-b-slate-100';
  } else if (filters.ordering == EProductOrdering.TitleDesc) {
    titleOrderingDivStyles += ' border-t-[0.625rem] border-t-slate-100';
  } else {
    titleOrderingDivStyles += ' !border-0 w-[0.625rem] aspect-square rounded-full bg-slate-400 opacity-70';
  }

  const isDataEmpty = !!data ? data.pages.flat().length == 0 : null;

  const togglePriceOrdering = () => {
    if (isDataEmpty) return;

    setFilters((prev) => {
      const priceOrderings = [EProductOrdering.PriceDesc, EProductOrdering.PriceAsc, EProductOrdering.None];
      const newOrderingIndex =
        (priceOrderings.findIndex((o) => o == filters.ordering) + 1) % priceOrderings.length;

      return { ...prev, ordering: priceOrderings[newOrderingIndex] };
    });

    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['products'] }), 100);
  };

  const toggleTitleOrdering = () => {
    if (isDataEmpty) return;

    setFilters((prev) => {
      const titleOrderings = [EProductOrdering.TitleAsc, EProductOrdering.TitleDesc, EProductOrdering.None];
      const newOrderingIndex =
        (titleOrderings.findIndex((o) => o == filters.ordering) + 1) % titleOrderings.length;

      return { ...prev, ordering: titleOrderings[newOrderingIndex] };
    });

    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['products'] }), 100);
  };

  if (status === 'pending' || storesQuery.status === 'pending') return <div>Загрузка...</div>;
  if (status === 'error' || storesQuery.status === 'error') return <div>{error?.message}</div>;

  const store = storesQuery.data?.find?.(store => store.id === Number(pathParams.storeId));
  if (store === undefined) return <div className='py-2'>Не найдено</div>;

  return (
    <div className="page gap-4">
      <h3 className="font-bold text-xl">{store.name}</h3>
      <ProductFilters
        filters={filters}
        setFilters={setFilters}
        onLimitChange={resetInfiniteQuery}
        onInvalidate={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
      />
      <div className="flex flex-row flex-wrap">
        <Link
          from="/business/store/$storeId"
          to="/business/product/$productId"
          search={{ storeId: Number(pathParams.storeId) }}
          params={{ productId: selectedProductUniqueId?.split('.')?.[0] ?? '' }}
          className="btn"
          disabled={!selectedProductUniqueId}
        >
          Редактировать
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr className="bg-slate-600">
            <th></th>
            <th>Фото</th>
            <th onClick={toggleTitleOrdering} className="cursor-pointer">
              <div className="flex flex-row items-center gap-2">
                Название <div className={titleOrderingDivStyles}></div>
              </div>
            </th>
            <th onClick={togglePriceOrdering} className="cursor-pointer">
              <div className="flex flex-row items-center gap-2">
                Цена <div className={priceOrderingDivStyles}></div>
              </div>
            </th>
            <th>Размер</th>
            <th>Вариация</th>
            <th>Описание</th>
            <th>Характеристики</th>
            <th>Склад</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={999}>
              <Link
                from="/business/store/$storeId"
                to="/business/product/new"
                search={{ storeId: Number(pathParams.storeId) }}
                className="flex py-6 relative text-transparent"
                title="Добавить новый товар"
              >
                +
                <div className="bg-slate-200 w-[0.15rem] h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="bg-slate-200 w-[0.15rem] h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
              </Link>
            </td>
          </tr>
          {data &&
            data.pages?.map((page) =>
              page.map((product) => (
                <Row
                  key={product.uniqueId}
                  product={product}
                  onSelect={setSelectedProductUniqueId}
                  isSelected={product.uniqueId === selectedProductUniqueId}
                />
              )),
            )}
        </tbody>
      </table>
      {isDataEmpty && <div className="self-center">Ничего не нашлось</div>}
      {isDataEmpty === false && (
        <div className="w-full flex">
          <LoadMoreBtn />
        </div>
      )}
    </div>
  );
}
