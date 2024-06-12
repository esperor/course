import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../api';
import Order from '../models/order';
import EOrderStatus, { orderStatusToString } from '../models/orderStatus';
import { replaceRouteParams } from '../utils/http';

function Orders() {
  const queryClient = useQueryClient();
  const query = useQuery<Order[]>(
    {
      queryKey: ['user-orders'],
      queryFn: async () => {
        const res = await axios.get(api.order.user);
        return res.data;
      },
    },
    queryClient,
  );
  const cancel = useMutation({
    mutationFn: async (id: number) => {
      await axios.put(replaceRouteParams(api.order.cancel, { id: id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
  });

  const handleCancel = async (id: number) => {
    console.log('1');
    await cancel.mutateAsync(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="py-2">Ваши заказы:</h2>
      <div className="w-full h-fit max-h-[70vh] overflow-y-scroll gap-[0.5rem] pr-1 flex flex-row flex-wrap">
        {query.data?.sort((a, b) => {
          if (a.status == EOrderStatus.Done || a.status == EOrderStatus.Canceled) return 1;
          if (b.status == EOrderStatus.Done || b.status == EOrderStatus.Canceled) return -1;
          return (a.date > b.date ? -1 : 1);
        }).map(
          (order) =>
            order && (
              <div
                className="flex flex-col bg-slate-950 p-4 rounded-lg shadow-lg flex-[0_0_calc(50%-0.5rem)]"
                key={order.id}
              >
                <h3>{`ID: ${order.id}`}</h3>
                <p>{order.address}</p>
                <p>{(new Date(order.date)).toLocaleDateString("ru")}</p>
                <p>{`Статус: ${orderStatusToString(order.status)}`}</p>
                <button
                  type="button"
                  onClick={() => handleCancel(order.id)}
                  className="ml-auto mt-4 btn"
                  disabled={
                    order.status == EOrderStatus.Canceled ||
                    order.status == EOrderStatus.Done
                  }
                >
                  Отменить
                </button>
              </div>
            ),
        )}
      </div>
    </div>
  );
}

export default Orders;
