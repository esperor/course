import {
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Deliverer from '../../../../models/deliverer';
import axios from 'axios';
import api from '../../../../api';
import DelivererPostModel from '../../../../models/delivererPostModel';

interface DelivererEditProps {
  deliverer: UseQueryResult<Deliverer>;
  form: DelivererPostModel | null;
  setForm: (r: DelivererPostModel) => void;
  formEdited: boolean;
}

export default function DelivererEdit({
  deliverer,
  form,
  setForm,
  formEdited,
}: DelivererEditProps) {
  const queryClient = useQueryClient();
  const updateDeliverer = useMutation({
    mutationFn: async (deliverer: DelivererPostModel) => {
      let model = {...deliverer, contactInfo: deliverer.contactInfo ?? null};
      return await axios.put(`${api.deliverer.rest}/${deliverer.userId}`, model);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['deliverer', deliverer.data?.id],
      });
      queryClient.invalidateQueries({ queryKey: ['deliverers'] });
      queryClient.invalidateQueries({ queryKey: ['deliverers-infinite'] });
    },
  });

  const handleSave = () => {
    if (!form || !formEdited) return;
    updateDeliverer.mutate(form);
  };

  return (
    <div className="p-8 flex flex-row h-full">
      {deliverer.isPending ? (
        <h2>Загрузка...</h2>
      ) : deliverer.isError ? (
        <h2>{deliverer.error.message}</h2>
      ) : (
        <div className="size-fit flex flex-col gap-2 m-auto">
          <div className="flex flex-row gap-2">
            <label htmlFor="contractNumber">Номер договора:&nbsp;</label>
            <input
              type="text"
              id="contractNumber"
              className="transparent bordered w-fit"
              value={form?.contractNumber}
              onChange={(e) =>
                setForm({ ...form!, contractNumber: e.target.value })
              }
            />
          </div>
          <div className="flex flex-row gap-2">
            <label htmlFor="contactInfo">Контакт:&nbsp;</label>
            <input
              type="text"
              id="contactInfo"
              className="transparent bordered"
              value={form?.contactInfo}
              onChange={(e) =>
                setForm({ ...form!, contactInfo: e.target.value })
              }
            />
          </div>

          <button
            type="button"
            className="btn mt-8 mx-auto"
            disabled={!formEdited}
            onClick={handleSave}
          >
            {updateDeliverer.isPending
              ? 'Загрузка...'
              : updateDeliverer.isSuccess
                ? 'Сохранено'
                : 'Сохранить'}
          </button>
        </div>
      )}
    </div>
  );
}
