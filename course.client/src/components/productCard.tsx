import { Link } from '@tanstack/react-router';
import ProductRecord from '../models/server/productRecordServer';
import randomStock from '../utils/randomStock';

function ProductCard({ product }: { product: ProductRecord }) {
  const productPresent: boolean = product.record && product.record.quantity > 0;

  return (
    <Link
      to={'/product/$recordId'}
      params={{ recordId: product.id.toString() }}
      className={`flex flex-col rounded-lg h-96 bg-slate-900 p-4 relative ${
        !productPresent && 'bg-gray-700'
      }`}
    >
      <img
        className={`absolute inset-0 w-full h-[75%] rounded-t-lg z-[0] object-contain ${productPresent ? '' : 'opacity-50'}`}
        src={
          product.record && product.record.image
            ? `data:image/*;base64,${product.record.image}`
            : `/stock/${randomStock()}.jpg`
        }
        alt={product.title}
      />
      <div className="flex flex-col h-[25%] absolute bottom-0 left-0 w-full px-4 pt-2 pb-4 gap-2">
        <div className="flex flex-row items-center">
          <p className="pb-3 text-lg font-medium">
            {productPresent ? `${product.record.price} руб.` : 'Нет в наличии'}
          </p>
        </div>
        <h4 className="z-[1] relative flex-row flex">
          <p
            title={product.storeName}
            className="max-w-[50%] overflow-hidden overflow-ellipsis text-nowrap"
          >
            {product.storeName}
          </p>
          &nbsp;/&nbsp;
          <p
            title={product.title}
            className="text-slate-400 overflow-hidden overflow-ellipsis text-nowrap"
          >
            {product.title}
          </p>
        </h4>
      </div>
    </Link>
  );
}

export default ProductCard;
