import axios from 'axios';
import api from '../../../../api';
import useInfiniteQueryReduced from '../../../../hooks/useInfiniteQueryReduced';
import constant from '../../../../utils/constants';
import Store from '../../../../models/server/store';

export default function StoresTab() {
  const { data, error, status, LoadMoreBtn } = useInfiniteQueryReduced<Store>({
    queryKey: ['stores-infinite'],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      const { data } = await axios.get(
        `${api.admin.store.getAll}?offset=${(pageParam as number) * constant.defaultLimit}&limit=${constant.defaultLimit}`,
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
            <th>ID владельца</th>
            <th>Название</th>
          </tr>
        </thead>
        <tbody>
          {data?.pages.map((page) =>
            page.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.ownerId}</td>
                <td>{store.name}</td>
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
