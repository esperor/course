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
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-fit pt-8 max-h-[75vh] bg-slate-700 z-20 overflow-y-auto rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onScroll={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
