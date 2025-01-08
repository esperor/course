import {
  UseQueryResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Vendor from '../../../../models/server/vendor';
import axios from 'axios';
import api from '../../../../api';

interface VendorEditProps {
  vendor: UseQueryResult<Vendor>;
  form: Vendor | null;
  setForm: (r: Vendor) => void;
  formEdited: boolean;
}

export default function VendorEdit({
  vendor,
  form,
  setForm,
  formEdited,
}: VendorEditProps) {
  const queryClient = useQueryClient();
  const updateVendor = useMutation({
    mutationFn: async (vendor: Vendor) => {
      return await axios.put(`${api.vendor.rest}/${vendor.id}`, vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vendor', vendor.data?.id],
      });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors-infinite'] });
    },
  });

  const handleSave = () => {
    if (!form || !formEdited) return;
    updateVendor.mutate(form);
  };

  return (
    <div className="p-8 flex flex-row h-full">
      {vendor.isPending ? (
        <h2>Загрузка...</h2>
      ) : vendor.isError ? (
        <h2>{vendor.error.message}</h2>
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
            <label htmlFor="name">Название организации:&nbsp;</label>
            <input
              id="name"
              type="text"
              className="transparent bordered w-72"
              value={form?.name}
              onChange={(e) => setForm({ ...form!, name: e.target.value })}
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
            {updateVendor.isPending
              ? 'Загрузка...'
              : updateVendor.isSuccess
                ? 'Сохранено'
                : 'Сохранить'}
          </button>
        </div>
      )}
    </div>
  );
}
