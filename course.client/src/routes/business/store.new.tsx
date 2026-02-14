import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import api from '../../api';
import StorePostModel from '../../models/server/requests/storePostModel';
import { authenticateSeller } from '../../utils/http';

export const Route = createFileRoute('/business/store/new')({
  component: NewStore,
  beforeLoad: authenticateSeller,
});

function NewStore() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<StorePostModel>({
    name: '',
  });
  const [succeded, setSucceded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postStore = useMutation({
    mutationFn: async (store: StorePostModel) => {
      return await axios.post(`/${api.business.store.create}`, store);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
      queryClient.invalidateQueries({ queryKey: ['stores-infinite'] });
      setSucceded(true);
    },
    onError: (error) => setError(error.message),
  });

  const formFilled = !!form?.name;

  const handlePost = () => {
    if (!formFilled) return;
    postStore.mutate(form);
  };

  return (
    <div className="flex flex-col p-4 h-full">
      <label htmlFor="name">Название</label>
      <input
        type="text"
        id="name"
        className="font-bold mb-4 transparent bordered w-fit"
        value={form?.name}
        onChange={(e) => {
          setSucceded(false);
          setForm({ ...form!, name: e.target.value });
        }}
      />
      <div className="flex flex-row gap-4 items-center">
        <button
          type="button"
          className="btn flex mr-auto"
          disabled={!formFilled || postStore.isPending || succeded}
          onClick={handlePost}
        >
          {postStore.isPending ? 'Загрузка...' : succeded ? 'Сохранено' : 'Создать'}
        </button>
        {error && <div className="text-red-600">{error}</div>}
      </div>
    </div>
  );
}
