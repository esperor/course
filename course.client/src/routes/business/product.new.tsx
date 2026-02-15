import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import api from '#/api';
import ProductPostModel from '#/models/server/requests/productPostModel';
import { authenticateSeller } from '#/utils/http';

export const Route = createFileRoute('/business/product/new')({
  component: NewProduct,
  beforeLoad: authenticateSeller,
  validateSearch: (search: Record<string, unknown>): { storeId: number | null } => {
    return {
      storeId: Number(search?.storeId ?? null),
    };
  },
});

function NewProduct() {
  const queryClient = useQueryClient();
  const searchParams = useSearch({ from: '/business/product/new' });
  const [form, setForm] = useState<ProductPostModel>({
    title: '',
    description: '',
    storeId: searchParams.storeId ?? -1,
  });
  const [succeded, setSucceded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postProduct = useMutation({
    mutationFn: async (product: ProductPostModel) => {
      return await axios.post(`/${api.business.product.create}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', searchParams.storeId] });
      setSucceded(true);
    },
    onError: (error) => setError(error.message),
  });

  const formFilled = !!form.title && !!form.description && form.storeId !== -1;

  const handlePost = () => {
    if (!formFilled) return;
    postProduct.mutate(form);
  };

  return (
    <div className="flex flex-col p-4 h-full gap-4">
      <div className="flex flex-col">
        <label htmlFor="title">Название</label>
        <input
          type="text"
          id="title"
          className="font-bold transparent bordered w-fit"
          value={form?.title}
          onChange={(e) => {
            setSucceded(false);
            setForm({ ...form!, title: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="description">Описание</label>
        <textarea
          id="description"
          className="transparent bordered h-16 align-top"
          value={form?.description}
          onChange={(e) => {
            setSucceded(false);
            setForm({ ...form!, description: e.target.value });
          }}
        />
      </div>
      <div className="flex flex-row gap-4 items-center">
        <button
          type="button"
          className="btn flex mr-auto"
          disabled={!formFilled || postProduct.isPending || succeded}
          onClick={handlePost}
        >
          {postProduct.isPending ? 'Загрузка...' : succeded ? 'Сохранено' : 'Создать'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
}
