import axios from 'axios';
import api from '../../../../api';
import useInfiniteQueryReduced from '../../../../hooks/useInfiniteQueryReduced';
import constant from '../../../../utils/constants';
import Seller from '../../../../models/server/seller';

export default function SellersTab() {
  const { data, error, status, LoadMoreBtn } =
    useInfiniteQueryReduced<Seller>({
      queryKey: ['sellers-infinite'],
      queryFn: async ({ pageParam }: { pageParam: unknown }) => {
        const { data } = await axios.get(
          `/${api.admin.seller.getAll}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
        );
        return data;
      },
      limit: constant.defaultLimit,
    });

  if (status == 'pending') return <div>Загрузка...</div>;
  if (status == 'error') return <div>{error?.message}</div>;

  return (
    <div>
      <table className="admin-table mt-4">
        <thead>
          <tr className="bg-slate-600">
            <th>ID</th>
            <th>Номер контракта</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Активен</th>
            <th>Заморожен</th>
            <th>Приостановлен</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((seller) => (
              <tr key={seller.userId}>
                <td>{seller.userId}</td>
                <td>{seller.contractNumber}</td>
                <td>{seller.name}</td>
                <td>{seller.phone}</td>
                <td>{seller.email}</td>
                <td>{seller.active ? 'Да' : 'Нет'}</td>
                <td>{seller.freezed ? 'Да' : 'Нет'}</td>
                <td>{seller.suspended ? 'Да' : 'Нет'}</td>
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
