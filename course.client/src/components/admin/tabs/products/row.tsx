import ProductRecord from '../../../../models/productRecord';
import randomStock from '../../../../utils/randomStock';
import BookOpen from '../../../assets/bookOpen';
import Pencil from '../../../assets/pencil';
import ThreeBars from '../../../assets/threeBars';
import Trash from '../../../assets/trash';

export default function Row({
  product,
  openedInventory,
  setOpenedInventory,
  openedOptions,
  setOpenedOptions,
  onAction,
}: {
  product: ProductRecord;
  openedInventory: number | null;
  setOpenedInventory: (id: number | null) => void;
  openedOptions: number | null;
  setOpenedOptions: (id: number | null) => void;
  onAction: (productId: number, action: 'delete' | 'edit') => void;
}) {
  return (
    <tr className="">
      <td>
        <div className="size-16 relative flex justify-center">
          <img
            src={
              product.records?.at(0)?.image
                ? `data:image/*;base64,${product.records?.at(0)?.image}`
                : `/stock/${randomStock()}.jpg`
            }
            alt={product.title}
            className="size-full object-cover max-w-max rounded-lg transition-all ease-in-out duration-500 absolute bottom-0 left-1/2 -translate-x-1/2 hover:size-48"
          />
        </div>
      </td>
      <td>{product.id}</td>
      <td>{product.title}</td>
      <td className="overflow-hidden overflow-ellipsis">
        {product.description}
      </td>
      <td title={`ID: ${product.vendorId}`}>{product.vendor}</td>
      <td>
        <div className="size-fit relative w-full">
          <button
            type="button"
            className="w-full flex justify-center active:scale-90 scale-100"
            onClick={() =>
              openedInventory == product.id
                ? setOpenedInventory(null)
                : setOpenedInventory(product.id)
            }
          >
            <BookOpen />
          </button>
          <div
            className={`absolute bottom-0 right-full bg-slate-800 p-4 rounded-lg transition-all ease-in-out duration-300 origin-bottom-right border-solid border border-slate-600
              ${openedInventory == product.id ? 'scale-100' : 'scale-0'}`}
          >
            {product.records &&
              product.records.map((record) => (
                <p className="text-nowrap">{`Размер: ${record.size} - Количество: ${record.quantity} - ${record.price} руб.`}</p>
              ))}
          </div>
        </div>
      </td>
      <td className="relative">
        <div
          className={`admin-options border-slate-500 absolute h-full top-0 right-0 bottom-0 items-center transition-all ease-in-out duration-300 flex bg-inherit
              ${openedOptions == product.id ? 'left-[-200%] border-solid border-l' : 'left-0'}`}
        >
          <button
            type="button"
            className={`transition-[opacity] ease-in-out duration-[200ms] delay-100 pl-4 pr-2 w-fit active:scale-[0.9_!important] scale-100
              ${openedOptions == product.id ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
            onClick={() => {
              onAction(product.id, 'delete');
              setOpenedOptions(null);
            }}
          >
            <Trash className="size-6" />
          </button>
          <button
            type="button"
            className={`transition-[opacity] ease-in-out duration-[200ms] delay-100 pl-4 pr-2 w-fit active:scale-[0.9_!important] scale-100
              ${openedOptions == product.id ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
            onClick={() => {
              onAction(product.id, 'edit');
              setOpenedOptions(null);
            }}
          >
            <Pencil />
          </button>
          <button
            type="button"
            className="w-fit flex justify-center absolute top-1/2 -translate-y-1/2 right-4 active:scale-90 scale-100"
            onClick={() =>
              openedOptions == product.id
                ? setOpenedOptions(null)
                : setOpenedOptions(product.id)
            }
          >
            <ThreeBars />
          </button>
        </div>
      </td>
    </tr>
  );
}
