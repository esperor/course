import axios from 'axios';
import api from '../api';
import CartItem from '../models/cartItem';
import CartProductRecord from '../models/cartProductRecord';
import ProductRecord from '../models/server/requests/productRecord';

export const cart = async () => {
  if (localStorage && localStorage.getItem('cart') != null) {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart')!);
    if (cart.length == 0) return null;

    const records = cart.map(async (cartItem) => {
      const response = await axios.get(
        `${api.product.rest}/${cartItem.productId}`,
      );
      const product = response.data as ProductRecord;
      const record = product.records?.find((r) => r.id == cartItem.recordId);
      if (!record) return null;

      const cartRecord: CartProductRecord = {
        id: record?.id,
        quantity: cartItem.quantity,
        serverQuantity: record?.quantity,
        title: product.title,
        size: record?.size,
        image: record?.image,
        price: record?.price,
        variation: record?.variation,
        description: product.description,
        productId: product.id,
        propertiesJson: record.propertiesJson,
      };
      return cartRecord;
    });

    return await Promise.all(records);
  } else return null;
};
