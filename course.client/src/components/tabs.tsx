import { useState } from 'react';

export default function Tabs({
  options,
  children,
  defaultIndex = 0,
}: {
  options: string[];
  children: React.ReactNode[];
  defaultIndex?: number;
}) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <>
      <div className="flex flex-row">
        {children.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`rounded-t-md px-4 py-2 ${index == activeIndex ? 'bg-slate-900 font-bold' : 'bg-gray-600'}`}
          >
            {options[index]}
          </button>
        ))}
      </div>
      <div className="w-[full] h-[2px] bg-slate-900" />
      <div className="w-full mt-4">
        {children[activeIndex]}
      </div>
    </>
  );
}
