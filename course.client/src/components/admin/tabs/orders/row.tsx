import OrderAdminInfo from '../../../../models/orderAdminInfo';
import { orderStatusToString } from '../../../../models/orderStatus';
import api from '../../../../api';
import axios from 'axios';
import InventoryRecord from '../../../../models/inventoryRecord';
import { useQuery } from '@tanstack/react-query';
import BookOpen from '../../../assets/bookOpen';

export default function Row({
  order,
  openedProducts,
  setOpenedProducts,
}: {
  order: OrderAdminInfo;
  openedProducts: number | null;
  setOpenedProducts: (id: number | null) => void;
}) {
  const records = useQuery({
    queryKey: ['order-records', order.id],
    queryFn: async () => {
      let arr: Array<[number, number]> = [];
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
  });

  return (
    <tr key={order.id}>
      <td>{order.id}</td>
      <td>{order.userId}</td>
      <td>{new Date(order.date).toLocaleDateString('ru')}</td>
      <td>
        <div className="flex flex-row gap-2">
          <p>
            {order.deliverer
              ? `${order.deliverer?.name} (ID: ${order.deliverer.id})`
              : 'Не назначен'}
          </p>
        </div>
      </td>
      <td>{order.address}</td>
      <td>{orderStatusToString(order.status)}</td>
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
            <p className="text-nowrap mt-4 ml-auto flex w-fit">{`Итого: ${order.totalPrice} руб.`}</p>
          </div>
        </div>
      </td>
    </tr>
  );
}
