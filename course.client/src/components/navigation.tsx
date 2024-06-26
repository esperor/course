import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import axios from 'axios';
import api from '../api';
import UserInfo from '../models/userInfo';
import EAccessLevel from '../models/accessLevel';

function Navigation() {
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

  const logout = useMutation({
    mutationFn: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      return axios.post(api.identity.logout);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-info'] });
      window.location.reload();
    },
  });

  const isUserSignedIn = query.data?.isSignedIn ?? false;
  const isUserAdmin =
    (query.data?.accessLevel ?? 0) >= EAccessLevel.Administrator;

  return (
    <nav className="p-4 px-[10%] flex gap-12 bg-gray-900">
      <Link to="/" className="[&.active]:font-bold">
        Каталог
      </Link>
      <Link to="/order" className="[&.active]:font-bold">
        Корзина
      </Link>
      {isUserSignedIn && (
        <Link to="/profile" className="[&.active]:font-bold">
          Профиль
        </Link>
      )}
      {isUserAdmin && (
        <Link to="/admin" search={{ tab: 0 }} className="[&.active]:font-bold">
          Управление
        </Link>
      )}
      <div className="ml-auto flex flex-row">
        {isUserSignedIn ? (
          <>
            <Link to="/profile">{query.data?.name}</Link>
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
    </nav>
  );
}

export default Navigation;
