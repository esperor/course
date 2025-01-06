import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import api from '../api';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { returnUrl?: string } => {
    return search?.returnUrl ?? '/';
  },
  component: Login,
});

function Login() {
  const { returnUrl } = Route.useSearch();
  const [form, setForm] = useState({
    phone: null as string | null,
    password: null as string | null,
  });
  const queryClient = useQueryClient();
  const login = useMutation({
    mutationFn: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return axios.post(api.identity.login, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-info'] });
      if (returnUrl) {
        window.location.href = returnUrl;
      }
    },
  });

  return (
    <div className="py-2 px-auto">
      <form
        onSubmit={login.mutate}
        className="flex flex-col mx-auto w-fit gap-2"
      >
        <label htmlFor="login">Телефон</label>
        <input
          type="text"
          id="login"
          className=""
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          id="password"
          className=""
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-fit mx-auto bg-slate-500 rounded-full py-2 px-6"
        >
          Войти
        </button>
        <div className="flex flex-row w-fit mx-auto">
          Нет аккаунта?&nbsp;
          <Link
            to="/register"
            className="link"
            search={{ returnUrl: `/login?returnUrl=${returnUrl}` }}
          >
            Зарегистрироваться
          </Link>
        </div>
        <label>{login.isError && login.error.message}</label>
      </form>
    </div>
  );
}
