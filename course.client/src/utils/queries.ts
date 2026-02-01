import axios from 'axios';
import api from '../api';
import CartItem from '../models/cartItem';
import CartProductRecord from '../models/cartProductRecord';
import { productAggregatedFromProductAggregatedModel } from '../models/productAggregated';
import ProductRecordServer from '../models/server/productRecordServer';
import { replaceRouteParams } from './http';

export const cart = async () => {
  if (localStorage && localStorage.getItem('cart') != null) {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart')!);
    if (cart.length == 0) return null;

    const records = cart.map(async (cartItem) => {
      const response = await axios.get(
        replaceRouteParams(`${api.public.product.get}`, {
          id: cartItem.productId,
        }),
      );
      const productSrv = response.data as ProductRecordServer;
      const product = productAggregatedFromProductAggregatedModel(productSrv);
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
        properties: record.properties,
      };
      return cartRecord;
    });

    return await Promise.all(records);
  } else return null;
};
