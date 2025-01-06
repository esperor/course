const parentOnBlur = (
  e: React.FocusEvent<HTMLElement>,
  parentQuerySelector: string,
  f: () => void,
) => {
  const parent = document.querySelector(parentQuerySelector)!;
  if (!parent.contains(e.relatedTarget)) f();
};

export default parentOnBlur;
