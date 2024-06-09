import PencilSquare from '../../../assets/pencilSquare';
import { useState } from 'react';
import useProducts from '../../../../hooks/useProducts';
import React from 'react';
import ProductFilters from '../../../productFilters';
import Row from './row';

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

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
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
              <th>Поставщик</th>
              <th>Склад</th>
              <th>
                <PencilSquare />
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.pages?.map((page) => (
                <React.Fragment key={page.at(0)?.id}>
                  {page.map((product) => (
                    <Row
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
