import {
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import ProductRecord from '../../../../models/server/requests/productRecord';
import randomStock from '../../../../utils/randomStock';
import Store from '../../../../models/server/store';
import axios from 'axios';
import api from '../../../../api';

interface ProductEditProps {
  product: UseQueryResult<ProductRecord>;
  form: ProductRecord | null;
  setForm: (r: ProductRecord) => void;
  stores: UseQueryResult<Store[]>;
  formEdited: boolean;
}

export default function ProductEdit({
  product,
  form,
  setForm,
  stores,
  formEdited,
}: ProductEditProps) {
  const queryClient = useQueryClient();
  const updateProduct = useMutation({
    mutationFn: async (product: ProductRecord) => {
      return await axios.put(`${api.product.rest}/${product.id}`, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', product.data?.id],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
  const store = stores?.data?.find((store) => store.id === form?.storeId);

  const handleSave = () => {
    if (!form || !formEdited) return;
    updateProduct.mutate(form);
  };

  return (
    <div className="p-8 flex flex-row h-full">
      {product.isPending ? (
        <h2>Загрузка...</h2>
      ) : product.isError ? (
        <h2>{product.error.message}</h2>
      ) : (
        <>
          <div className="w-[70%] flex flex-col gap-2">
            <input
              type="text"
              className="font-bold mb-4 transparent bordered w-fit"
              value={form?.title}
              onChange={(e) => setForm({ ...form!, title: e.target.value })}
            />
            <textarea
              className="transparent bordered h-16 align-top"
              value={form?.description}
              onChange={(e) =>
                setForm({ ...form!, description: e.target.value })
              }
            />
            {stores.isPending ? (
              <h2>Загрузка...</h2>
            ) : stores.isError ? (
              <h2>{stores.error.message}</h2>
            ) : (
              store && (
                <div className="flex flex-row gap-2">
                  <p>Магазин:&nbsp;</p>
                  <select
                    className="transparent bordered w-fit"
                    value={form?.storeId}
                    onChange={(e) =>
                      setForm({
                        ...form!,
                        storeId: parseInt(e.target.value),
                      })
                    }
                  >
                    {stores.data?.map((store) => (
                      <option
                        key={store.id}
                        value={store.id}
                      >
                        {store.id}:&nbsp;{store.name}
                      </option>
                    ))}
                  </select>
                </div>
              )
            )}
            <button
              type="button"
              className="btn mt-8 mx-auto"
              disabled={!formEdited}
              onClick={handleSave}
            >
              {updateProduct.isPending
                ? 'Загрузка...'
                : updateProduct.isSuccess
                  ? 'Сохранено'
                  : 'Сохранить'}
            </button>
          </div>
          <div className="mt-auto ml-auto w-[25%]">
            <img
              className="mt-8 rounded-md"
              src={
                form?.records?.at(0)?.image
                  ? `data:image/*;base64,${form?.records?.at(0)?.image}`
                  : `/stock/${randomStock()}.jpg`
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
