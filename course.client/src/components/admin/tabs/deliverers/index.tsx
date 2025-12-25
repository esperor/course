import axios from 'axios';
import api from '../../../../api';
import useInfiniteQueryReduced from '../../../../hooks/useInfiniteQueryReduced';
import constant from '../../../../utils/constants';
import Deliverer from '../../../../models/server/deliverer';
import PencilSquare from '../../../assets/pencilSquare';
import RowOptions from '../rowOptions';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import DelivererCreateModal from './delivererCreateModal';
import DelivererEditModal from './delivererEditModal';

export default function DeliverersTab() {
  const { data, error, status, queryClient, LoadMoreBtn } =
    useInfiniteQueryReduced<Deliverer>({
      queryKey: ['deliverers-infinite'],
      queryFn: async ({ pageParam }: { pageParam: unknown }) => {
        const { data } = await axios.get(
          `${api.deliverer.rest}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
        );
        return data;
      },
      limit: constant.defaultLimit,
    });
  const deleteDeliverer = useMutation({
    mutationFn: async (delivererId: number) => {
      return await axios.delete(`${api.deliverer.rest}/${delivererId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliverers-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['deliverers'] });
    },
  });

  const [openedOptions, setOpenedOptions] = useState<number | null>(null);
  const [editingDelivererId, setEditingDelivererId] = useState<number | null>(
    null,
  );
  const [creatingDeliverer, setCreatingDeliverer] = useState(false);

  const handleActionDelete = (delivererId: number) => {
    if (confirm('Вы уверены?')) deleteDeliverer.mutate(delivererId);
  }

  const handleActionEdit = (delivererId: number) => {
    setEditingDelivererId(delivererId);
  }

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
      <button
        type="button"
        className="btn flex ml-auto mb-4"
        onClick={() => setCreatingDeliverer(true)}
      >
        Назначить доставщика
      </button>
      {creatingDeliverer && (
        <DelivererCreateModal onClose={() => setCreatingDeliverer(false)} />
      )}
      {editingDelivererId && (
        <DelivererEditModal
          delivererId={editingDelivererId}
          onClose={() => setEditingDelivererId(null)}
        />
      )}
      <table className="admin-table mt-4">
        <thead>
          <tr className="bg-slate-600">
            <th>ID</th>
            <th>Номер контракта</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Контакты</th>
            <th className="justify-center flex options">
              <PencilSquare />
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((deliverer) => (
              <tr key={deliverer.id}>
                <td>{deliverer.id}</td>
                <td>{deliverer.contractNumber}</td>
                <td>{deliverer.name}</td>
                <td>{deliverer.phone}</td>
                <td>{deliverer.contactInfo}</td>
                <RowOptions
                  itemId={deliverer.id}
                  openedOptions={openedOptions}
                  setOpenedOptions={setOpenedOptions}
                  onActionDelete={handleActionDelete}
                  onActionEdit={handleActionEdit}
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
