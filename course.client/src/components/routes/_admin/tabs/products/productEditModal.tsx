import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '#/api';
import ProductRecord from '#/models/server/productRecordServer';
import { useEffect, useState } from 'react';
import Reset from '#/components/assets/reset';
import Store from '#/models/server/store';
import ProductEdit from './productEdit';
import Modal from '#/components/modal';
import { replaceRouteParams } from '#/utils/http';

export default function ProductEditModal({
  productId,
  onClose,
}: {
  productId: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const product = useQuery<ProductRecord>(
    {
      queryKey: ['product', productId],
      queryFn: async () => {
        const { data } = await axios.get(
          replaceRouteParams(`/${api.public.product.get}`, { id: productId }),
        );
        return data;
      },
    },
    queryClient,
  );
  const [form, setForm] = useState<ProductRecord | null>(null);
  const stores = useQuery<Store[]>(
    {
      queryKey: ['stores'],
      queryFn: async () => {
        const { data } = await axios.get(`/${api.public.store.getAll}`);
        return data;
      },
    },
    queryClient,
  );

  useEffect(() => {
    if (!product.data) return;
    setForm(product.data);
  }, [product.data]);

  const formEdited =
    form?.description !== product.data?.description ||
    form?.title !== product.data?.title ||
    form?.storeId !== product.data?.storeId;

  const handleClose = () => {
    if (formEdited) return;
    onClose();
  };

  const handleReset = () => {
    setForm(product.data!);
  };

  return (
    <Modal onClose={handleClose}>
      <div className="absolute right-6 top-6 flex flex-row gap-6 items-center">
        {form && (
          <button
            type="button"
            onClick={handleReset}
            className="size-6 scale-100 active:scale-90"
          >
            <Reset />
          </button>
        )}
        <button
          type="button"
          onClick={handleClose}
          className="size-6 scale-100 active:scale-90"
        >
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 rotate-45`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 -rotate-45`}
          ></div>
        </button>
      </div>
      <ProductEdit
        product={product}
        form={form}
        setForm={setForm}
        stores={stores}
        formEdited={formEdited}
      />
    </Modal>
  );
}
