import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import UserInfo from '../models/userInfo';
import api from '../api';
import axios from 'axios';
import Cart from '../components/cart';
import Orders from '../components/orders';

export const Route = createFileRoute('/profile')({
  component: Profile,
  beforeLoad: async ({ location }) => {
    const data: UserInfo = await axios
      .get(api.identity.userInfo)
      .then((response) => response.data);

    if (!data || !data.isSignedIn)
      throw redirect({
        to: '/login',
        search: {
          returnUrl: location.href,
        },
      });
  },
});

function Profile() {
  const queryClient = useQueryClient();
  const query = useQuery<UserInfo>(
    {
      queryKey: ['user-info'],
      queryFn: async () => {
        const res = await axios.get(api.identity.userInfo);
        return res.data;
      },
    },
    queryClient,
  );

  return (
    <div className="page flex flex-col gap-4">
      <h2>Здравствуйте, {query.data?.name}</h2>
      <div className="grid grid-cols-2 gap-10">
        <Cart />
        <Orders />
      </div>
    </div>
  );
}
