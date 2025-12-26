import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import api from '../api';
import UserInfo from '../models/server/requests/userInfo';
import EAccessLevel from '../models/accessLevel';

function Navigation() {
  const queryClient = useQueryClient();
  const query = useQuery<UserInfo>(
    {
      queryKey: ['user-info'],
      queryFn: async () => {
        const res = await axios.get(api.public.identity.userInfo);
        return res.data;
      },
    },
    queryClient,
  );

  const logout = useMutation({
    mutationFn: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      return axios.post(api.public.identity.logout);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-info'] });
      window.location.reload();
    },
  });

  const isUserSignedIn = query.data?.isSignedIn ?? false;
  const isUserAdmin =
    (query.data?.info?.accessLevel ?? 0) >= EAccessLevel.Administrator;
  const isUserSeller = query.data?.info?.isRegisteredSeller ?? false;

  return (
    <nav className="p-4 px-[10%]  bg-gray-900 sticky top-0 border-b-[1px] border-slate-500 z-[100]">
      <div id="inner-nav" className="flex gap-12">
        <Link to="/" className="[&.active]:font-bold">
          Каталог
        </Link>
        <Link to="/order" className="[&.active]:font-bold">
          Корзина
        </Link>
        {isUserSeller && (
          <Link to="/business" className="[&.active]:font-bold">
            Бизнес
          </Link>
        )}
        {isUserSignedIn && (
          <Link to="/profile" className="[&.active]:font-bold">
            Профиль
          </Link>
        )}
        {isUserAdmin && (
          <Link
            to="/admin/panel"
            className="[&.active]:font-bold"
          >
            Управление
          </Link>
        )}
        <div className="ml-auto flex flex-row">
          {isUserSignedIn ? (
            <>
              <Link to="/profile">{query.data?.info?.name}</Link>
              <div className="h-full bg-gray-100 w-[1px] mx-2"></div>
              <button type="button" onClick={logout.mutate}>
                Выйти
              </button>
            </>
          ) : (
            <Link to="/login" search={{ returnUrl: window.location.href }}>
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
