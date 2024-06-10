export default function Tabs({
  options,
  children,
  current,
  setCurrent,
}: {
  options: string[];
  children: React.ReactNode[];
  current: number;
  setCurrent: (index: number) => void;
}) {
  return (
    <>
      <div className="flex flex-row">
        {children.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setCurrent(index)}
            className={`rounded-t-md px-4 py-2 ${index == current ? 'bg-slate-900 font-bold' : 'bg-gray-600'}`}
          >
            {options[index]}
          </button>
        ))}
      </div>
      <div className="w-[full] h-[2px] bg-slate-900" />
      <div className="w-full mt-4">
        {children[current]}
      </div>
    </>
  );
}
