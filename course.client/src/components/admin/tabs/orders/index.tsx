import axios from 'axios';
import api from '../../../../api';
import useInfiniteQueryReduced from '../../../../hooks/useInfiniteQueryReduced';
import constant from '../../../../utils/constants';
import OrderAdminInfo from '../../../../models/orderInfo';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Row from './row';

export default function OrdersTab() {
  const { data, error, status, queryClient, LoadMoreBtn } =
    useInfiniteQueryReduced<OrderAdminInfo>({
      queryKey: ['orders-infinite'],
      queryFn: async ({ pageParam }: { pageParam: unknown }) => {
        const { data } = await axios.get(
          `${api.order.rest}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
        );
        return data;
      },
      limit: constant.defaultLimit,
    });
  const deleteOrder = useMutation({
    mutationFn: async (orderId: number) => {
      return await axios.delete(`${api.order.rest}/${orderId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders-infinite'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const [openedProducts, setOpenedProducts] = useState<number | null>(null);

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
      <table className="admin-table mt-4">
        <thead>
          <tr className="bg-slate-600">
            <th>ID</th>
            <th>ID клиента</th>
            <th>Дата</th>
            <th>Доставщик</th>
            <th>Адрес</th>
            <th>Статус</th>
            <th>Товары</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((order) => (
              <Row
                order={order}
                openedProducts={openedProducts}
                setOpenedProducts={setOpenedProducts}
              />
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
