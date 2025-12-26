import { useState } from 'react';
import useProducts from '../../../../hooks/useProducts';
import React from 'react';
import ProductFilters from '../../../productFilters';
import Row from './row';
import ProductEditModal from './productEditModal';
import ProductCreateModal from './productCreateModal';

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
  const [openedInventory, setOpenedInventory] = useState<number | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

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
              <th>Название</th>
              <th>Описание</th>
              <th>Магазин</th>
              <th>Склад</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.pages?.map((page) => (
                <React.Fragment key={page.at(0)?.id}>
                  {page.map((product) => (
                    <Row
                      key={product.id}
                      product={product}
                      openedInventory={openedInventory}
                      setOpenedInventory={setOpenedInventory}
                    />
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
        <div className="w-full flex mt-4">
          <LoadMoreBtn />
        </div>
      </div>
    </div>
  );
}
