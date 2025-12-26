import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import api from '../api';

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>): { returnUrl?: string } => {
    return search?.returnUrl ?? '/';
  },
  component: Register,
});

function Register() {
  const { returnUrl } = Route.useSearch();
  const [form, setForm] = useState({
    name: null as string | null,
    phone: null as string | null,
    password: null as string | null,
  });
  const queryClient = useQueryClient();
  const register = useMutation({
    mutationFn: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      return axios.post(api.public.identity.register, form);
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
        onSubmit={register.mutate}
        className="flex flex-col mx-auto w-fit gap-2"
      >
        <label htmlFor="name">Имя</label>
        <input
          type="text"
          id="name"
          className=""
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
          className="w-fit mx-auto bg-slate-800 rounded-full"
        >
          Зарегистрироваться
        </button>
        <label>{register.isError && register.error.message}</label>
      </form>
    </div>
  );
}
