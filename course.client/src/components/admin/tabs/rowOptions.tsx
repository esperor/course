import Pencil from '../../assets/pencil';
import ThreeBars from '../../assets/threeBars';
import Trash from '../../assets/trash';

export interface RowOptionsProps {
  itemId: number;
  openedOptions: number | null;
  setOpenedOptions: (id: number | null) => void;
  onAction: (id: number, action: 'delete' | 'edit') => void;
}

export default function RowOptions({
  itemId,
  openedOptions,
  setOpenedOptions,
  onAction,
}: RowOptionsProps) {
  return (
    <td className="relative options">
      <div
        className={`admin-options border-slate-500 absolute h-full top-0 right-0 bottom-0 items-center transition-all ease-in-out duration-300 flex bg-inherit
              ${openedOptions == itemId ? 'left-[-6rem] border-solid border-l' : 'left-0'}`}
      >
        <button
          type="button"
          className={`transition-[opacity] ease-in-out duration-[200ms] delay-100 pl-4 pr-2 w-fit active:scale-[0.9_!important] scale-100
              ${openedOptions == itemId ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
          onClick={() => {
            onAction(itemId, 'delete');
            setOpenedOptions(null);
          }}
        >
          <Trash className="size-6" />
        </button>
        <button
          type="button"
          className={`transition-[opacity] ease-in-out duration-[200ms] delay-100 pl-4 pr-2 w-fit active:scale-[0.9_!important] scale-100
              ${openedOptions == itemId ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
          onClick={() => {
            onAction(itemId, 'edit');
            setOpenedOptions(null);
          }}
        >
          <Pencil />
        </button>
        <button
          type="button"
          className="w-fit flex justify-center absolute top-1/2 -translate-y-1/2 right-4 active:scale-90 scale-100"
          onClick={() =>
            openedOptions == itemId
              ? setOpenedOptions(null)
              : setOpenedOptions(itemId)
          }
          onBlur={() => setOpenedOptions(null)}
        >
          <ThreeBars />
        </button>
      </div>
    </td>
  );
}
