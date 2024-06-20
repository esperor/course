import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import api from '../api';
import { useMask } from '@react-input/mask';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { returnUrl?: string } => {
    return search?.returnUrl ?? '/';
  },
  component: Login,
});

function Login() {
  const ref = useMask({
    mask: '8__________',
    replacement: { _: /\d/ },
    showMask: true,
  });
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

  const formValid = form.phone?.length == 11 && form.password != null;

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
          ref={ref}
          className=""
          value={form.phone ?? ''}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <label htmlFor="password">Пароль</label>
        <input
          type="password"
          id="password"
          className=""
          value={form.password ?? ''}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          disabled={!formValid}
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
