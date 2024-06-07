import CartItem from '../models/cartItem';

export function addToCart(item: CartItem) {
  localStorage.setItem(
    'cart',
    JSON.stringify([...JSON.parse(localStorage.getItem('cart') || '[]'), item]),
  );
}

export function removeFromCart(recordId: number) {
  let cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter((i) => i.recordId != recordId);
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function readCart(): CartItem[] {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

export function clearCart() {
  localStorage.removeItem('cart');
}