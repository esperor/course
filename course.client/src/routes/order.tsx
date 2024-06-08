import { createFileRoute } from '@tanstack/react-router';
import { authenticate } from '../utils/http';
import Cart from '../components/cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import api from '../api';
import { useState } from 'react';
import OrderModel from '../models/order';
import { clearCart, readCart } from '../utils/cart';

export const Route = createFileRoute('/order')({
  component: Order,
  beforeLoad: authenticate,
});

function Order() {
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: ['cart-storage'],
    queryFn: () => readCart(),
  });
  const [form, setForm] = useState<OrderModel>({
    address: '',
    orderedRecords: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [hasOrdered, setHasOrdered] = useState(false);
  const postOrder = useMutation(
    {
      mutationFn: async (formData: OrderModel) => {
        return await axios.post(api.order.rest, formData);
      },
      onSuccess() {
        clearCart();
        setHasOrdered(true);
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['cart-storage'] });
        queryClient.invalidateQueries({ queryKey: ['user-orders'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      },
    },
    queryClient,
  );

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await queryClient.invalidateQueries({ queryKey: ['cart-storage'] });
    const cart = await queryClient.fetchQuery({
      queryKey: ['cart-storage'],
      queryFn: () => readCart(),
    });
    if (cart.length === 0) {
      setError('Корзина пуста');
      return;
    }
    const records = cart.reduce(
      (acc, item) => {
        // @ts-expect-error
        acc[item.recordId] = item.quantity;
        return acc;
      },
      {} as { [key: number]: number }[],
    );
    const newForm = {
      ...form,
      orderedRecords: records,
    };
    setForm(newForm);
    postOrder.mutate(newForm);
  };

  return (
    <div className="page">
      <h1>Заказать доставку</h1>
      <div className="flex flex-row gap-10 mt-4">
        <div className="w-1/2">
          <Cart />
        </div>

        <form className="w-1/2 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label htmlFor="address" className="mt-2">
            Адрес
          </label>
          <input
            type="text"
            id="address"
            className="w-2/3"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          ></input>
          <div className="flex flex-row gap-4 items-center">
            <button
              className="btn"
              type="submit"
              disabled={
                hasOrdered || !form.address || cartQuery.data?.length === 0
              }
            >
              {hasOrdered ? 'Заказ оформлен' : 'Заказать'}
            </button>
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
