import axios from 'axios';
import api from '../../../../api';
import useInfiniteQueryReduced from '../../../../hooks/useInfiniteQueryReduced';
import constant from '../../../../utils/constants';
import OrderAdminInfo from '../../../../models/server/requests/orderInfo';
import { useState } from 'react';
import Row from './row';
import AssignDelivererModal from './assignDelivererModal';

export default function OrdersTab() {
  const { data, error, status, LoadMoreBtn } =
    useInfiniteQueryReduced<OrderAdminInfo>({
      queryKey: ['orders-infinite'],
      queryFn: async ({ pageParam }: { pageParam: unknown }) => {
        const { data } = await axios.get(
          `/${api.admin.order.getAll}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
        );
        return data;
      },
      limit: constant.defaultLimit,
    });

  const [assigningDelivererId, setAssigningDelivererId] = useState<
    number | null
  >(null);

  const [openedProducts, setOpenedProducts] = useState<number | null>(null);

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
      {assigningDelivererId && (
        <div>
          <AssignDelivererModal
            orderId={assigningDelivererId}
            onClose={() => setAssigningDelivererId(null)}
          />
        </div>
      )}
      <table className="admin-table mt-4">
        <thead>
          <tr className="bg-slate-600">
            <th>ID</th>
            <th>ID клиента</th>
            <th>Дата</th>
            <th>Доставщик</th>
            <th>Адрес</th>
            <th>Статус</th>
            <th>Стоимость</th>
            <th>Товары</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((order) => (
              <Row
                key={order.id}
                order={order}
                openedProducts={openedProducts}
                setOpenedProducts={setOpenedProducts}
                setAssigningDelivererId={setAssigningDelivererId}
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
