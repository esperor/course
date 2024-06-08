import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addToCart, readCart, removeFromCart } from '../utils/cart';

function ProductCounter({
  recordId,
  productId,
  quantity,
  onChange,
}: {
  recordId: number;
  productId: number;
  quantity: number;
  onChange?: (recordId: number, newQuantity: number) => void;
}) {
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: ['cart-storage'],
    queryFn: () => readCart(),
  });
  const cart = cartQuery.data;

  const addProductToCart = (recordId: number, productId: number) => {
    let recordQuantityInCart = cart!.find(
      (item) => item?.recordId == recordId,
    )?.quantity;
    if (recordQuantityInCart) removeFromCart(recordId);
    const newQuantity = recordQuantityInCart ? recordQuantityInCart + 1 : 1;
    addToCart({
      productId: productId,
      recordId: recordId,
      quantity: newQuantity,
    });
    if (onChange) onChange(recordId, newQuantity);
    queryClient.invalidateQueries({ queryKey: ['cart-storage'] });
  };

  const subtractProductFromCart = (recordId: number, productId: number) => {
    let recordQuantityInCart = cart!.find(
      (item) => item?.recordId == recordId,
    )?.quantity;
    if (recordQuantityInCart) {
      removeFromCart(recordId);
      const newQuantity = recordQuantityInCart - 1;
      if (recordQuantityInCart > 1)
        addToCart({
          productId: productId,
          recordId: recordId,
          quantity: newQuantity,
        });
      if (onChange) onChange(recordId, newQuantity);
    }
    queryClient.invalidateQueries({ queryKey: ['cart-storage'] });
  };

  if (!cart || cartQuery.isPending) return <p>Загрузка...</p>;

  return (
    <div className="ml-auto my-1 w-fit flex-nowrap flex flex-row">
      {cart && cart.find((item) => item?.recordId == recordId) && (
        <button
          type="button"
          className="w-6 bg-slate-800 rounded-md active:scale-90"
          onClick={() => subtractProductFromCart(recordId, productId)}
        >
          -
        </button>
      )}
      <p className="px-1">
        {cart &&
          (cart.find((item) => item?.recordId == recordId)?.quantity ?? 0)}
      </p>
      <button
        type="button"
        className="w-6 bg-slate-800 rounded-md active:scale-90 disabled:opacity-0 disabled:cursor-default"
        onClick={() => addProductToCart(recordId, productId)}
        disabled={cart && (cart.find((item) => item?.recordId == recordId)?.quantity || 0) >= quantity }
      >
        +
      </button>
    </div>
  );
}

export default ProductCounter;
