import { useState } from 'react';
import ProductPostModel from '../../../../models/server/requests/productPostModel';
import Modal from '../../../modal';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import api from '../../../../api';
import Store from '../../../../models/server/store';

export default function ProductCreateModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
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
  const [form, setForm] = useState<ProductPostModel | null>(null);
  const [hasPosted, setHasPosted] = useState(false);
  const postProduct = useMutation({
    mutationFn: async (product: ProductPostModel) => {
      return await axios.post(`/${api.business.product.create}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setHasPosted(true);
    },
  });

  const formFilled = form?.title && form?.description && form?.storeId;

  const handlePost = () => {
    if (!formFilled) return;
    postProduct.mutate(form);
  };

  return (
    <Modal onClose={onClose}>
      <button
        type="button"
        onClick={onClose}
        className="size-6 absolute right-6 top-6 scale-100 active:scale-90"
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 rotate-45`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[2px] w-full mx-auto bg-slate-200 -rotate-45`}
        ></div>
      </button>
      <div className="flex flex-col p-4 h-full">
        <label htmlFor="title">Название</label>
        <input
          type="text"
          id="title"
          className="font-bold mb-4 transparent bordered w-fit"
          value={form?.title}
          onChange={(e) => {
            setHasPosted(false);
            setForm({ ...form!, title: e.target.value });
          }}
        />

        <label htmlFor="description" className="mt-4">
          Описание
        </label>
        <textarea
          id="description"
          className="transparent bordered h-16 align-top"
          value={form?.description}
          onChange={(e) => {
            setHasPosted(false);
            setForm({ ...form!, description: e.target.value });
          }}
        />

        <label htmlFor="storeId" className="mt-4">
          Поставщик
        </label>
        <select
          id="storeId"
          className="transparent bordered h-fit"
          value={form?.storeId ?? stores.data?.[0]?.id}
          onChange={(e) => {
            setHasPosted(false);
            setForm({ ...form!, storeId: parseInt(e.target.value) });
          }}
        >
          {stores.data?.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>

        <div className="mt-auto w-full h-fit">
          <button
            type="button"
            className="btn mt-8 flex mx-auto"
            disabled={!formFilled || postProduct.isPending || hasPosted}
            onClick={handlePost}
          >
            {postProduct.isPending
              ? 'Загрузка...'
              : hasPosted
                ? 'Сохранено'
                : 'Создать'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
