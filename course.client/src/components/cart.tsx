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
    <div className="flex flex-col gap-2 h-full">
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
      <div className="w-full overflow-y-scroll flex-1 grid grid-flow-row md:grid-cols-1 lg:grid-cols-2 gap-[0.5rem]">
        {query.data &&
          query.data
            .sort((cartRecord1, cartRecord2) =>
              // TODO: check if server sent an inventory record
              cartRecord1?.id! > cartRecord2?.id! ? 1 : -1,
            )
            .map(
              (cartRecord) =>
                cartRecord && (
                  <div
                    className="rounded-md shadow-md border-none relative bg-slate-900 flex flex-1 basis-96 min-h-72 h-fit flex-col"
                    key={cartRecord?.id}
                  >
                    <img
                      className="w-full aspect-square rounded-t-lg object-cover hover:object-contain"
                      src={
                        cartRecord.image
                          ? `data:image/*;base64,${cartRecord.image}`
                          : `/stock/${randomStock()}.jpg`
                      }
                    ></img>
                    <div className="flex flex-col w-full">
                      <div className="flex flex-row items-center my-2 mx-2 gap-4 justify-between">
                        <h3 className="text-center p-2 w-full overflow-clip">
                          {cartRecord.title}
                        </h3>
                        <button
                          type="button"
                          className="active:scale-90 scale-100 p-2"
                          title="Удалить"
                          onClick={() => handleRemove(cartRecord.id)}
                        >
                          <Trash />
                        </button>
                      </div>
                      <div className='p-2 flex flex-col gap-1'>
                      {!!cartRecord.size && (
                        <p className="text-wrap">{`Размер: ${cartRecord.size}`}</p>
                      )}
                      <p className="text-wrap">{`Вариант: ${cartRecord.variation}`}</p>
                      <div className="self-end">
                        <ProductCounter
                          recordId={cartRecord.id}
                          productId={cartRecord.productId}
                          quantity={cartRecord.serverQuantity}
                          onChange={handleCounterChange}
                        />
                      </div>
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
