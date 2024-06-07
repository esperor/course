import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import * as queries from '../utils/queries';
import ProductCounter from './productCounter';
import randomStock from '../utils/randomStock';
import { clearCart, removeFromCart } from '../utils/cart';
import { useEffect, useState } from 'react';

function Cart() {
  const queryClient = useQueryClient();
  const query = useQuery(
    {
      queryKey: ['cart'],
      queryFn: queries.cart,
    },
    queryClient,
  );
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  useEffect(() => {
    if (!(query.data && query.data.length > 0)) return;
    setTotalPrice(
      query.data
        .map((item) => (item ? item.price * item.quantity : 0))
        .reduce((prev, curr) => prev + curr, 0),
    );
  }, [query.data]);

  function handleCounterChange() {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }

  function handleClearCart() {
    clearCart();
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }

  function handleRemove(recordId: number) {
    removeFromCart(recordId);
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }

  if (query.isPending) return <p>Загрузка...</p>;
  if (query.isError) return <p>Произошла ошибка: {query.error.message}</p>;
  if (query.data?.length == 0 || query.data == null)
    return <p>Ваша корзина пуста</p>;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 items-center">
        <h2>Ваша корзина:</h2>
        <button
          type="button"
          className="ml-auto btn"
          disabled={query.data?.length == 0 || query.data == null}
          onClick={handleClearCart}
        >
          Очистить
        </button>
        <Link to="/order">{`Заказать | ${totalPrice} руб.`}</Link>
      </div>
      <div className="w-full overflow-y-scroll h-fit max-h-[70vh] flex flex-row flex-wrap gap-[0.5rem]">
        {query.data &&
          query.data.sort((item1, item2) => item1?.recordId! > item2?.recordId! ? 1 : -1).map(
            (item) =>
              item && (
                <div
                  className="rounded-md shadow-md border-none relative bg-slate-900 w-[calc(50%-0.5rem)] aspect-[3/2] flex flex-col"
                  key={item?.recordId}
                >
                  <img
                    className="w-full h-[50%] absolute inset-0 rounded-t-lg"
                    src={
                      item.image
                        ? `data:image/*;base64,${item.image}`
                        : `/stock/${randomStock()}.jpg`
                    }
                  ></img>
                  <h3 className="text-center p-2 w-full overflow-clip mt-[50%]">
                    {item.title}
                  </h3>
                  <div className="flex flex-row items-center my-2 mx-2">
                    <p className="text-wrap">{`Размер: ${item.size} - ${item.price} руб.`}</p>
                    <ProductCounter
                      recordId={item.recordId}
                      productId={item.productId}
                      onChange={handleCounterChange}
                    />
                    <button
                      type="button"
                      className="ml-2 active:scale-90 scale-100"
                      title="Удалить"
                      onClick={() => handleRemove(item.recordId)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        className="size-4 stroke-slate-100"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ),
          )}
      </div>
    </div>
  );
}

export default Cart;
