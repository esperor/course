import axios from 'axios';
import api from '../api';
import CartItem from '../models/cartItem';
import CartProductRecord from '../models/cartProductRecord';
import ProductRecord from '../models/productRecord';

export const cart = async () => {
  if (localStorage && localStorage.getItem('cart') != null) {
    let cart: CartItem[] = JSON.parse(localStorage.getItem('cart')!);
    if (cart.length == 0) return null;

    const records = cart.map(async (cartItem) => {
      const response = await axios.get(
        `${api.product.rest}/${cartItem.productId}`,
      );
      const product = response.data as ProductRecord;
      let record = product.records?.find((r) => r.id == cartItem.recordId);
      if (!record) return null;
      let cartRecord: CartProductRecord = {
        recordId: record?.id,
        quantity: cartItem.quantity,
        serverQuantity: record?.quantity,
        title: product.title,
        size: record?.size,
        image: record?.image,
        price: record?.price,
        description: product.description,
        productId: product.id,
      };
      return cartRecord;
    });

    return await Promise.all(records);
  } else return null;
};
