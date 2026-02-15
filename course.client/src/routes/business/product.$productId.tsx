import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, useSearch } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import api from '#/api/index.ts';
import { authenticateSeller, replaceRouteParams } from '#/utils/http.ts';
import ProductAggregatedModel from '#/models/server/productAggregatedModel.ts';
import InventoryRecordServer from '#/models/server/inventoryRecordServer';
import PropertiesEditor, { PropertiesEditorRef } from '#/components/routes/business/product.productId/propertiesEditor';

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
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const propertiesEditorRef = useRef<PropertiesEditorRef>(null);
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
    propertiesEditorRef?.current?.reset();
  }, [selectedRecordId]);

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

  function handleRecordChange<T extends keyof InventoryRecordServer>(
    id: number,
    key: T,
    value: InventoryRecordServer[T],
  ) {
    setForm((prev) => {
      const records = prev.records;
      if (!records) return prev;

      records.forEach((record) => {
        if (record.id === id)
          record[key] = (value === '' && key === 'size' ? null : value) as InventoryRecordServer[T];
      });

      return { ...prev, records };
    });
    setSucceded(false);
  }

  const handleAddNewRecord = () => {
    setForm((prev) => ({
      ...prev,
      records: [...(prev.records ?? []), { id: -1, size: undefined, price: 0, quantity: 0, variation: '', image: undefined }],
    }));
    setSucceded(false);
  }

  return (
    <div className="flex flex-row gap-6 p-4 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
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
          <label>Варианты</label>
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Фото</th>
                <th>Размер</th>
                <th>Вариация</th>
                <th>Цена</th>
                <th>Количество</th>
              </tr>
            </thead>
            <tbody>
              {!!form.records &&
                form.records.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedRecordId(record.id)}
                    className={record.id === selectedRecordId ? '!bg-yellow-900' : ''}
                  >
                    <td>
                      <div
                        className={`rounded-full ${record.id === selectedRecordId ? 'bg-white' : 'bg-transparent'} aspect-square self-center w-2`}
                      ></div>
                    </td>
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
                    <td>
                      <input
                        className="transparent bordered"
                        onChange={(e) => handleRecordChange(record.id, 'size', e.target.value)}
                        value={record.size ?? ''}
                      />
                    </td>
                    <td>
                      <input
                        className="transparent bordered"
                        onChange={(e) => handleRecordChange(record.id, 'variation', e.target.value)}
                        value={record.variation}
                      />
                    </td>
                    <td>
                      <input
                        className="transparent bordered"
                        // prettier-ignore
                        onChange={(e) => handleRecordChange(record.id, 'price', Number(e.target.value))}
                        value={record.price}
                        type="number"
                      />
                    </td>
                    <td>{record.quantity}</td>
                  </tr>
                ))}
              <tr>
                <td colSpan={999}>
                  <button
                    type="button"
                    className="flex py-4 relative text-transparent w-full"
                    title="Добавить новую вариацию"
                    onClick={handleAddNewRecord}
                  >
                    +
                    <div className="bg-slate-200 w-[2px] h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="bg-slate-200 w-[2px] h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90"></div>
                  </button>
                </td>
              </tr>
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
      <div className="flex flex-col basis-1/2 gap-2">
        <label htmlFor="propertiesJson">Характеристики</label>
        {!!selectedRecordId ? (
          <PropertiesEditor
            ref={propertiesEditorRef}
            properties={JSON.parse(
              form?.records?.find((r) => r.id === selectedRecordId)?.propertiesJson ?? '{}',
            )}
            onChange={(properties) =>
              handleRecordChange(selectedRecordId, 'propertiesJson', JSON.stringify(properties))
            }
          />
        ) : (
          'выберите строку'
        )}
      </div>
    </div>
  );
}
