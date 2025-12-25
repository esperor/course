import axios from 'axios';
import api from '../../../../api';
import useInfiniteQueryReduced from '../../../../hooks/useInfiniteQueryReduced';
import constant from '../../../../utils/constants';
import Store from '../../../../models/server/store';
import PencilSquare from '../../../assets/pencilSquare';
import RowOptions from '../rowOptions';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export default function StoresTab() {
  const { data, error, status, queryClient, LoadMoreBtn } =
    useInfiniteQueryReduced<Store>({
      queryKey: ['stores-infinite'],
      queryFn: async ({ pageParam }: { pageParam: unknown }) => {
        const { data } = await axios.get(
          `${api.store.rest}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
        );
        return data;
      },
      limit: constant.defaultLimit,
    });
  const deleteStore = useMutation({
    mutationFn: async (storeId: number) => {
      return await axios.delete(`${api.store.rest}/${storeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });

  const [openedOptions, setOpenedOptions] = useState<number | null>(null);

  const handleAction = (storeId: number, action: 'delete' | 'edit') => {
    switch (action) {
      case 'delete':
        deleteStore.mutate(storeId);
        break;
    }
  };

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
      <table className="admin-table mt-4">
        <thead>
          <tr className="bg-slate-600">
            <th>ID</th>
            <th>ID владельца</th>
            <th>Название</th>
            <th className="justify-center flex options">
              <PencilSquare />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.ownerId}</td>
                <td>{store.name}</td>
                <RowOptions
                  itemId={store.id}
                  openedOptions={openedOptions}
                  setOpenedOptions={setOpenedOptions}
                  onAction={handleAction}
                />
              </tr>
            )),
          )}
        </tbody>
      </table>
      <div className="w-full flex mt-4">
        <LoadMoreBtn />
      </div>
    </div>
  );
}
