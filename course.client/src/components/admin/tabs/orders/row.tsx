import OrderAdminInfo from '../../../../models/server/requests/orderAdminInfo';
import api from '../../../../api';
import axios from 'axios';
import InventoryRecord from '../../../../models/inventoryRecord';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BookOpen from '../../../assets/bookOpen';
import Pencil from '../../../assets/pencil';
import { replaceRouteParams } from '../../../../utils/http';
import { ChangeEvent, useState } from 'react';
import EOrderStatus from '../../../../models/orderStatus';

export default function Row({
  order,
  openedProducts,
  setOpenedProducts,
  setAssigningDelivererId,
}: {
  order: OrderAdminInfo;
  openedProducts: number | null;
  setOpenedProducts: (id: number | null) => void;
  setAssigningDelivererId: (id: number | null) => void;
}) {
  const queryClient = useQueryClient();
  const records = useQuery(
    {
      queryKey: ['order-records', order.id],
      queryFn: async () => {
        const arr: Array<[number, number]> = [];
        Object.keys(order.orderedRecords).forEach((key) => {
          const k = parseInt(key);
          arr.push([k, order.orderedRecords[k]]);
        });
        return Promise.all(
          arr.map(async ([recordId, quantity]) => {
            const { data } = await axios.get<InventoryRecord>(
              `${api.inventory.get}/${recordId}`,
            );
            return { record: data, quantity };
          }),
        ).then((records) => records);
      },
      enabled: openedProducts == order.id,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    queryClient,
  );
  const [status, setStatus] = useState(order.status);

  const updateStatus = useMutation(
    {
      mutationFn: async (status: number) => {
        return await axios.put(
          replaceRouteParams(api.order.setStatus, { id: order.id }),
          { status },
        );
      },
      onSuccess: (_, status) => {
        setStatus(status);
      },
    },
    queryClient,
  );

  function handleStatusChange(event: ChangeEvent<HTMLSelectElement>): void {
    updateStatus.mutate(parseInt(event.target.value));
  }

  return (
    <tr key={order.id}>
      <td>{order.id}</td>
      <td>{order.userId}</td>
      <td>{new Date(order.date).toLocaleDateString('ru')}</td>
      <td>
        <div className="flex flex-row justify-between">
          <p>
            {order.deliverer
              ? `${order.deliverer?.name} (ID: ${order.deliverer.id})`
              : 'Не назначен'}
          </p>
          <button
            type="button"
            className="active:scale-90 scale-100"
            onClick={() => setAssigningDelivererId(order.id)}
          >
            <Pencil />
          </button>
        </div>
      </td>
      <td>{order.address}</td>
      <td className='mx-auto flex'>
        <select value={status} className="transparent bordered py-[0.2rem] px-3" onChange={handleStatusChange}>
          {(Object.keys(EOrderStatus) as Array<keyof typeof EOrderStatus>)
            .filter((result) => isNaN(Number(result)))
            .map((status) => [status, EOrderStatus[status]])
            .map(([status, statusIndex]) => (
              <option key={statusIndex} value={statusIndex}>
                {status}
              </option>
            ))}
        </select>
      </td>
      <td className="text-right">{order.totalPrice}&nbsp;₽</td>
      <td>
        <div className="size-fit relative w-full">
          <button
            type="button"
            className="w-full flex justify-center active:scale-90 scale-100"
            onClick={() =>
              openedProducts == order.id
                ? setOpenedProducts(null)
                : setOpenedProducts(order.id)
            }
            onBlur={() => setOpenedProducts(null)}
          >
            <BookOpen />
          </button>
          <div
            className={`absolute bottom-0 right-full bg-slate-800 p-4 rounded-lg transition-all ease-in-out duration-300 origin-bottom-right border-solid border border-slate-600
              ${openedProducts == order.id ? 'scale-100' : 'scale-0'}`}
          >
            {records.isPending ? (
              <p>Загрузка...</p>
            ) : records.isError ? (
              <p>{records.error.message}</p>
            ) : (
              records.data &&
              records.data.map(({ record, quantity }) => (
                <p className="text-nowrap">{`${record.title} (Размер: ${record.size}) - ${quantity} ед.`}</p>
              ))
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
