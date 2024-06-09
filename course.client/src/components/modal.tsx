export default function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-transparent z-20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fixed inset-[15%] bg-slate-700 z-20 overflow-y-scroll rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
