import ProductCounter from './productCounter';
import ProductRecord from '../models/productRecord';
import randomStock from '../utils/randomStock';

function ProductCard({
  product,
  openedInventory,
  setOpenedInventory,
}: {
  product: ProductRecord;
  openedInventory: number | null;
  setOpenedInventory: (value: number | null) => void;
}) {
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
      className={`flex flex-col rounded-lg h-96 bg-slate-900 p-4 relative
        ${!productPresent && 'bg-gray-700'} 
        ${openedInventory == product.id && 'rounded-b-none'}`}
      key={product.id}
    >
      <img
        className={`absolute inset-0 w-full h-[75%] rounded-t-lg object-cover z-[0] hover:object-contain ${productPresent ? '' : 'opacity-50'}`}
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
          <button
            type="button"
            className="ml-auto w-6 h-6 active:scale-90 scale-100 disabled:invisible"
            onClick={() =>
              setOpenedInventory(
                openedInventory == product.id ? null : product.id,
              )
            }
            disabled={!productPresent}
          >
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-full mx-auto bg-slate-200 origin-center transition-all ease-in-out 
              ${openedInventory == product.id ? 'rotate-45' : 'rotate-0'}`}
            ></div>
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-full mx-auto bg-slate-200 origin-center transition-all ease-in-out 
              ${openedInventory == product.id ? '-rotate-45' : 'rotate-90'}`}
            ></div>
          </button>
        </div>
        <h4 className="z-[1] relative flex-row flex">
          <p
            title={product.vendor}
            className="max-w-[50%] overflow-hidden overflow-ellipsis text-nowrap"
          >
            {product.vendor}
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

      {openedInventory == product.id && (
        <div className="absolute p-4 pt-0 h-fit w-full left-0 top-[100%] z-10 flex flex-col bg-slate-900 rounded-b-lg">
          {product.records &&
            product.records.length > 0 &&
            product.records.map((record) => (
              <div className="flex flex-row" key={record.id}>
                <p>{`Размер: ${record.size} - ${record.price} руб.`}</p>
                <ProductCounter
                  recordId={record.id}
                  productId={product.id}
                  quantity={record.quantity}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default ProductCard;
