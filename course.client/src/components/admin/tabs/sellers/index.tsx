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
          `${api.seller.rest}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
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
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.contractNumber}</td>
                <td>{seller.name}</td>
                <td>{seller.phone}</td>
                <td>{seller.email}</td>
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
