import { createFileRoute, Link } from '@tanstack/react-router';
import { authenticate } from '../../utils/http';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import StoreInfo from '../../models/server/requests/storeInfo';
import axios from 'axios';
import api from '../../api';

export const Route = createFileRoute('/business/')({
  component: Business,
  beforeLoad: authenticate,
});

function Business() {
  const queryClient = useQueryClient();
  const query = useQuery<StoreInfo[]>(
    {
      queryKey: ['business-stores'],
      queryFn: async () => {
        const res = await axios.get(api.business.store.getAll);
        return res.data;
      },
    },
    queryClient,
  );

  if (!query.data) return <div>Loading...</div>;

  return (
    <div className="grid grid-flow-row 2xl:grid-cols-4 xl:grid-cols-4 md:grid-cols-3 gap-6 mt-6 mb-16">
      {query.data.map((store) => (
        <Link
          key={store.id}
          to={'/business/store/$storeId'}
          params={{ storeId: store.id.toString() }}
          className="flex border border-slate-500 px-4 py-3 rounded-md"
        >
          {store.name}
        </Link>
      ))}
    </div>
  );
}
