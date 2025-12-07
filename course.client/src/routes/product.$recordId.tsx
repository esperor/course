import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import api from '../api';
import ProductRecord from '../models/server/requests/productRecord';
import randomStock from '../utils/randomStock';
import ProductCounter from '../components/productCounter';

export const Route = createFileRoute('/product/$recordId')({
  component: Product,
  loader: ({ params }) => axios.get(`/${api.product.rest}/${params.recordId}`),
});

function Product() {
  const productRequest = Route.useLoaderData();

  if (!productRequest.data) return 'Загрузка...';

  const product = productRequest.data as ProductRecord;
  const record = product.records?.at(0);

  const productPresent: boolean =
    (product.records &&
      product.records.length > 0 &&
      product.records.reduce(
        // check if any record is in stock
        (prev, curr) => prev || curr.quantity > 0,
        false,
      )) ||
    false;

  return (
    <div
      className={`flex flex-row flex-wrap h-full bg-slate-900 content-baseline p-8 relative gap-8 ${
        !productPresent ? 'bg-gray-700' : ''}`}
      key={product.id}
    >
      <img
        className={`flex-1 basis-96 rounded-lg z-[0] object-contain ${productPresent ? '' : 'opacity-50'}`}
        src={
          product.records && product.records.at(0)?.image
            ? `data:image/*;base64,${product.records.at(0)?.image}`
            : `/stock/${randomStock()}.jpg`
        }
        alt={product.title}
      />
      <div className="flex flex-col h-[25%] flex-1 basis-96 pb-4 gap-2">
        <div className="flex flex-row flex-wrap items-center justify-between">
          <p
            title={product.title}
            className="overflow-hidden text-2xl font-medium overflow-ellipsis text-nowrap"
          >
            {product.title}
          </p>
          <div className="flex flex-row gap-4">
            <ProductCounter
              recordId={record!.id}
              productId={product.id}
              quantity={record!.quantity}
            />
            <p className="text-xl font-medium">
              {productPresent
                ? `${product.records!.reduce((acc, record) => Math.min(acc, record.price), Infinity)} руб.`
                : 'Нет в наличии'}
            </p>
          </div>
        </div>
        <h4 className="z-[1] relative flex-row flex">
          <p
            title={product.vendor}
            className="text-slate-400 max-w-[50%] overflow-hidden overflow-ellipsis text-nowrap"
          >
            {product.vendor}
          </p>
        </h4>
        <p className="mt-6">{product.description}</p>
      </div>
    </div>
  );
}
