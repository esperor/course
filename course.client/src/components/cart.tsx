import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import * as queries from '../utils/queries';
import ProductCounter from './productCounter';
import randomStock from '../utils/randomStock';
import { clearCart, removeFromCart } from '../utils/cart';
import { useEffect, useState } from 'react';
import Trash from './assets/trash';

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
          query.data
            .sort((item1, item2) =>
              item1?.recordId! > item2?.recordId! ? 1 : -1,
            )
            .map(
              (item) =>
                item && (
                  <div
                    className="rounded-md shadow-md border-none relative bg-slate-900 w-[calc(50%-0.5rem)] h-72 flex flex-col"
                    key={item?.recordId}
                  >
                    <img
                      className="w-full h-[70%] absolute inset-0 rounded-t-lg object-cover hover:object-contain"
                      src={
                        item.image
                          ? `data:image/*;base64,${item.image}`
                          : `/stock/${randomStock()}.jpg`
                      }
                    ></img>
                    <div className="flex flex-col w-full h-[30%] absolute bottom-0 left-0">
                      <h3 className="text-center p-2 w-full overflow-clip">
                        {item.title}
                      </h3>
                      <div className="flex flex-row items-center my-2 mx-2">
                        <p className="text-wrap">{`Размер: ${item.size} - ${item.price} руб.`}</p>
                        <ProductCounter
                          recordId={item.recordId}
                          productId={item.productId}
                          quantity={item.serverQuantity}
                          onChange={handleCounterChange}
                        />
                        <button
                          type="button"
                          className="ml-2 active:scale-90 scale-100"
                          title="Удалить"
                          onClick={() => handleRemove(item.recordId)}
                        >
                          <Trash />
                        </button>
                      </div>
                    </div>
                  </div>
                ),
            )}
      </div>
    </div>
  );
}

export default Cart;
