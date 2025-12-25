import ProductRecord from '../models/server/productRecordServer';
import randomStock from '../utils/randomStock';

function ProductCard({ product }: { product: ProductRecord }) {
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
    <button
      type="button"
      onClick={() => (window.location.href = `/product/${product.id}`)}
      className={`flex flex-col rounded-lg h-96 bg-slate-900 p-4 relative
        ${!productPresent && 'bg-gray-700'}`}
      key={product.id}
    >
      <img
        className={`absolute inset-0 w-full h-[75%] rounded-t-lg z-[0] object-contain ${productPresent ? '' : 'opacity-50'}`}
        src={
          product.records && product.records.at(0)?.image
            ? `data:image/*;base64,${product.records.at(0)?.image}`
            : `/stock/${randomStock()}.jpg`
        }
        alt={product.title}
      />
      <div className="flex flex-col h-[25%] absolute bottom-0 left-0 w-full px-4 pt-2 pb-4 gap-2">
        <div className="flex flex-row items-center">
          <p className="pb-3 text-lg font-medium">
            {productPresent
              ? `${product.records!.reduce((acc, record) => Math.min(acc, record.price), Infinity)} руб.`
              : 'Нет в наличии'}
          </p>
        </div>
        <h4 className="z-[1] relative flex-row flex">
          <p
            title={product.store}
            className="max-w-[50%] overflow-hidden overflow-ellipsis text-nowrap"
          >
            {product.store}
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
    </button>
  );
}

export default ProductCard;
