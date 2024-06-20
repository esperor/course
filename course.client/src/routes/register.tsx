import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import api from '../api';
import { useMask } from '@react-input/mask';

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>): { returnUrl?: string } => {
    return search?.returnUrl ?? '/';
  },
  component: Register,
});

function Register() {
  const ref = useMask({
    mask: '8__________',
    replacement: { _: /\d/ },
    showMask: true,
  });
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
      return axios.post(api.identity.register, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-info'] });
      if (returnUrl) {
        window.location.href = returnUrl;
      }
    },
  });

  const formValid =
    form.name != null && form.phone?.length == 11 && form.password != null;

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
          value={form.name ?? ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <label htmlFor="login">Телефон</label>
        <input
          ref={ref}
          type="text"
          id="login"
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
          className="btn w-fit mx-auto rounded-full"
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}
