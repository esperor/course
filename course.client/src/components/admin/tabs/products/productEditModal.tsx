import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../api';
import ProductRecord from '../../../../models/productRecord';
import { useEffect, useState } from 'react';
import Reset from '../../../assets/reset';
import Vendor from '../../../../models/server/vendor';
import ProductEdit from './productEdit';
import Modal from '../../../modal';

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
        const { data } = await axios.get(`${api.product.rest}/${productId}`);
        return data;
      },
    },
    queryClient,
  );
  const [form, setForm] = useState<ProductRecord | null>(null);
  const vendors = useQuery<Vendor[]>(
    {
      queryKey: ['vendors'],
      queryFn: async () => {
        const { data } = await axios.get(`${api.vendor.rest}`);
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
    form?.vendorId !== product.data?.vendorId;

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
        vendors={vendors}
        formEdited={formEdited}
      />
    </Modal>
  );
}
