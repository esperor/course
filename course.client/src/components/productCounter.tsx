import { addToCart, readCart, removeFromCart } from '../utils/cart';
import { useState } from 'react';

function ProductCounter({
  recordId,
  productId,
  onChange,
}: {
  recordId: number;
  productId: number;
  onChange?: (recordId: number, newQuantity: number) => void;
}) {
  const [cart, setCart] = useState(readCart());

  const addProductToCart = (recordId: number, productId: number) => {
    let recordQuantityInCart = cart.find(
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
    setCart(readCart());
  };

  const subtractProductFromCart = (recordId: number, productId: number) => {
    let recordQuantityInCart = cart.find(
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
    setCart(readCart());
  };

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
        className="w-6 bg-slate-800 rounded-md active:scale-90"
        onClick={() => addProductToCart(recordId, productId)}
      >
        +
      </button>
    </div>
  );
}

export default ProductCounter;
