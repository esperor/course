import ProductRecord from '../../../../models/productRecord';

export default function Row({
  product,
  onSelect,
  isSelected,
}: {
  product: ProductRecord;
  onSelect?: (uniqueId: string) => void;
  isSelected: boolean;
}) {
  const record = product.record;

  return (
    <tr onClick={() => onSelect?.(product.uniqueId)} className={isSelected ? '!bg-yellow-900' : ''}>
      <td>
        <div
          className={`rounded-full ${isSelected ? 'bg-white' : 'bg-transparent'} aspect-square self-center w-2`}
        ></div>
      </td>
      <td>
        {!!record?.image ? (
          <div className="size-16 relative flex justify-center">
            <img
              src={`data:image/*;base64,${record.image}`}
              className="size-full object-cover max-w-max rounded-lg transition-all ease-in-out duration-500 absolute bottom-0 left-1/2 -translate-x-1/2 hover:size-48"
            />
          </div>
        ) : (
          <div className="text-red-400">нет фото</div>
        )}
      </td>
      <td>{product.title}</td>
      <td>{record?.price ?? '-'}</td>
      <td>{record?.size ?? '-'}</td>
      <td>{record?.variation ?? '-'}</td>
      <td className="overflow-hidden overflow-ellipsis">{product.description}</td>
      <td>{JSON.stringify(record?.properties) ?? '-'}</td>
      <td className={`${record?.quantity === undefined ? 'text-red-400' : ''}`}>
        {record?.quantity ?? 'нет записей'}
      </td>
    </tr>
  );
}
