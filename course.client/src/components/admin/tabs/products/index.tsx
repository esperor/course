import { useState } from 'react';
import useProducts from '../../../../hooks/useProducts';
import ProductFilters from '../../../productFilters';
import Row from './row';
import ProductEditModal from './productEditModal';
import ProductCreateModal from './productCreateModal';
import EProductOrdering from '../../../../models/productOrdering';

export default function ProductsTab() {
  const {
    filters,
    setFilters,
    resetInfiniteQuery,
    data,
    error,
    status,
    queryClient,
    LoadMoreBtn,
  } = useProducts();
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

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

  const togglePriceOrdering = () => {
    setFilters((prev) => {
      const priceOrderings = [EProductOrdering.PriceDesc, EProductOrdering.PriceAsc, EProductOrdering.None];
      const newOrderingIndex =
        (priceOrderings.findIndex((o) => o == filters.ordering) + 1) % priceOrderings.length;

      return { ...prev, ordering: priceOrderings[newOrderingIndex] };
    });

    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['products'] }), 100);
  };

  const toggleTitleOrdering = () => {
    setFilters((prev) => {
      const titleOrderings = [EProductOrdering.TitleAsc, EProductOrdering.TitleDesc, EProductOrdering.None];
      const newOrderingIndex =
        (titleOrderings.findIndex((o) => o == filters.ordering) + 1) % titleOrderings.length;

      return { ...prev, ordering: titleOrderings[newOrderingIndex] };
    });

    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['products'] }), 100);
  };

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
      <button
        type="button"
        className="btn flex ml-auto mb-4"
        onClick={() => setCreatingProduct(true)}
      >
        Добавить товар
      </button>
      {creatingProduct && (
        <ProductCreateModal onClose={() => setCreatingProduct(false)} />
      )}
      {editingProductId && (
        <ProductEditModal
          productId={editingProductId}
          onClose={() => setEditingProductId(null)}
        />
      )}
      <div>
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          onLimitChange={resetInfiniteQuery}
          onInvalidate={() =>
            queryClient.invalidateQueries({ queryKey: ['products'] })
          }
        />
        <table className="admin-table mt-4">
          <thead>
            <tr className="bg-slate-600">
              <th>Фото</th>
              <th>ID</th>
              <th onClick={toggleTitleOrdering} className='cursor-pointer'>
                <div className="flex flex-row items-center gap-2">
                  Название <div className={titleOrderingDivStyles}></div>
                </div>
              </th>
              <th onClick={togglePriceOrdering} className='cursor-pointer'>
                <div className="flex flex-row items-center gap-2">
                  Цена <div className={priceOrderingDivStyles}></div>
                </div>
              </th>
              <th>Размер</th>
              <th>Вариация</th>
              <th>Описание</th>
              <th>Магазин</th>
              <th>Склад</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.pages?.map((page) =>
                page.map((product) => (
                  <Row key={product.uniqueId} product={product} />
                )),
              )}
          </tbody>
        </table>
        <div className="w-full flex mt-4">
          <LoadMoreBtn />
        </div>
      </div>
    </div>
  );
}
