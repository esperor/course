import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import api from '#/api/index.ts';
import { authenticateSeller, replaceRouteParams } from '#/utils/http.ts';
import ProductAggregatedModel from '#/models/server/productAggregatedModel.ts';

export const Route = createFileRoute('/business/product/$productId')({
  component: EditProduct,
  beforeLoad: authenticateSeller,
  validateSearch: (search: Record<string, unknown>): { storeId: number | null } => {
    return {
      storeId: Number(search?.storeId ?? null),
    };
  },
});

function EditProduct() {
  const queryClient = useQueryClient();
  const pathParams = Route.useParams();
  const productId = pathParams.productId;
  const searchParams = useSearch({ from: '/business/product/$productId' });
  const [form, setForm] = useState<ProductAggregatedModel>({
    id: Number(productId),
    title: '',
    description: '',
    storeId: searchParams.storeId ?? -1,
    storeName: '',
  });
  const [succeded, setSucceded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const productQuery = useQuery<ProductAggregatedModel>(
    {
      queryKey: ['product', productId],
      queryFn: async () => {
        const { data } = await axios.get(
          replaceRouteParams(`/${api.public.product.get}`, { id: productId }),
        );
        return data;
      },
      refetchOnWindowFocus: false
    },
    queryClient,
  );
  const productSerialized = useMemo(() => !!productQuery.data ? JSON.stringify(productQuery.data) : null, [productQuery.data]);
  const putProduct = useMutation({
    mutationFn: async (product: ProductAggregatedModel) => {
      return await axios.put(`/${replaceRouteParams(api.business.product.update, { id: product.id })}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', searchParams.storeId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setSucceded(true);
    },
    onError: (error) => setError(error.message),
  });

  useEffect(() => {
    if (productQuery.data) {
      setForm(productQuery.data);
    }
  }, [productQuery.data]);

  const formFilled =
    !!form.id &&
    !!form.title &&
    !!form.description &&
    !!form.storeId &&
    !!form.storeName &&
    JSON.stringify(form) !== productSerialized;

  const handlePut = () => {
    if (!formFilled) return;
    putProduct.mutate(form);
  };

  function handleRecordSizeChange(id: number, value: string): void {
    setForm(prev => {
      const records = prev.records;
      if (!records) return prev;

      records.forEach((record) => {
        if (record.id === id) record.size = value;
      });

      return { ...prev, records };
    });
    setSucceded(false);
  }

  function handleRecordVariationChange(id: number, value: string): void {
   setForm(prev => {
      const records = prev.records;
      if (!records) return prev;

      records.forEach((record) => {
        if (record.id === id) record.variation = value;
      });

      return { ...prev, records };
    });
    setSucceded(false);
  }

  function handleRecordPriceChange(id: number, value: string): void {
    setForm(prev => {
      const records = prev.records;
      if (!records) return prev;

      records.forEach((record) => {
        if (record.id === id) record.price = Number(value);
      });

      return { ...prev, records };
    });
    setSucceded(false);
  }

  function handleRecordQuantityChange(id: number, value: string): void {
    setForm(prev => {
      const records = prev.records;
      if (!records) return prev;

      records.forEach((record) => {
        if (record.id === id) record.quantity = Number(value);
      });

      return { ...prev, records };
    });
    setSucceded(false);
  }
  
  function handleRecordPropertiesJsonChange(id: number, value: string): void {
    setForm(prev => {
      const records = prev.records;
      if (!records) return prev;

      records.forEach((record) => {
        if (record.id === id) record.propertiesJson = (value === '' ? undefined : value);
      });

      return { ...prev, records };
    });
    setSucceded(false);
  }

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
            setForm((prev) => ({ ...prev, title: e.target.value }));
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
            setForm((prev) => ({ ...prev, description: e.target.value }));
          }}
        />
      </div>
      <div className="flex flex-col">
        <label>Склад</label>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>Размер</th>
              <th>Вариация</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Характеристики</th>
            </tr>
          </thead>
          <tbody>
            {!!form.records &&
              form.records.map((record) => (
                <tr key={record.id}>
                  <td>
                    {!!record.image ? (
                      <div className="size-16 relative flex justify-center">
                        <img
                          src={`data:image/*;base64,${record.image}`}
                          className="size-full object-cover max-w-max rounded-lg transition-all ease-in-out duration-500 absolute bottom-0 left-1/2 -translate-x-1/2 hover:size-48"
                        />
                      </div>
                    ) : (
                      <div className="text-red-400">нет фото</div>
                    )}
                  </td>
                  <td><input onChange={(e) => handleRecordSizeChange(record.id, e.target.value)} value={record.size} /></td>
                  <td><input onChange={(e) => handleRecordVariationChange(record.id, e.target.value)} value={record.variation} /></td>
                  <td><input onChange={(e) => handleRecordPriceChange(record.id, e.target.value)} value={record.price} type='number' /></td>
                  <td><input onChange={(e) => handleRecordQuantityChange(record.id, e.target.value)} value={record.quantity} type='number' /></td>
                  <td><input onChange={(e) => handleRecordPropertiesJsonChange(record.id, e.target.value)} value={record.propertiesJson ?? ''} /></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <button
          type="button"
          className="btn flex mr-auto"
          disabled={!formFilled || putProduct.isPending || succeded}
          onClick={handlePut}
        >
          {putProduct.isPending ? 'Загрузка...' : succeded ? 'Сохранено' : 'Обновить'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
}
