import ProductRecord from '#/models/productRecord';
import randomStock from '#/utils/randomStock';

export default function Row({
  product,
}: {
  product: ProductRecord;
}) {
  const record = product.record;

  return (
    <tr className="">
      <td>
        <div className="size-16 relative flex justify-center">
          <img
            src={
              record?.image
                ? `data:image/*;base64,${record?.image}`
                : `/stock/${randomStock()}.jpg`
            }
            alt={product.title}
            className="size-full object-cover max-w-max rounded-lg transition-all ease-in-out duration-500 absolute bottom-0 left-1/2 -translate-x-1/2 hover:size-48"
          />
        </div>
      </td>
      <td>{product.uniqueId}</td>
      <td>{product.title}</td>
      <td>{record?.price}</td>
      <td>{record?.size ?? '-'}</td>
      <td>{record?.variation ?? '-'}</td>
      <td className="overflow-hidden overflow-ellipsis">
        {product.description}
      </td>
      <td title={`ID: ${product.storeId}`}>{product.storeName}</td>
      <td className={`${record?.quantity === undefined ? 'text-red-400' : ''}`}>{record?.quantity ?? 'нет записей'}</td>
    </tr>
  );
}
