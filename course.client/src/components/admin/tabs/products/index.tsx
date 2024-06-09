import PencilSquare from '../../../assets/pencilSquare';
import { useState } from 'react';
import useProducts from '../../../../hooks/useProducts';
import React from 'react';
import ProductFilters from '../../../productFilters';
import Row from './row';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../api';
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
  const [openedOptions, setOpenedOptions] = useState<number | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

  const deleteProduct = useMutation({
    mutationFn: async (productId: number) => {
      return await axios.delete(`${api.product.rest}/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleAction = (productId: number, action: 'delete' | 'edit') => {
    switch (action) {
      case 'delete':
        deleteProduct.mutate(productId);
        break;
      case 'edit':
        setEditingProductId(productId);
        break;
    }
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
              <th>Название</th>
              <th>Описание</th>
              <th>Поставщик</th>
              <th>Склад</th>
              <th className="justify-center flex options">
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
                      openedOptions={openedOptions}
                      setOpenedOptions={setOpenedOptions}
                      onAction={handleAction}
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
