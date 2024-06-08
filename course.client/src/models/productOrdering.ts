enum EProductOrdering {
  None = 0,
  TitleAsc = 1,
  TitleDesc = 2,
  PriceAsc = 3,
  PriceDesc = 4,
}

export const productOrderingMap: Record<EProductOrdering, string> = {
  [EProductOrdering.None]: 'По умолчанию',
  [EProductOrdering.TitleAsc]: 'По названию (А - Я)',
  [EProductOrdering.TitleDesc]: 'По названию (Я - А)',
  [EProductOrdering.PriceAsc]: 'По цене (возр.)',
  [EProductOrdering.PriceDesc]: 'По цене (убыв.)',
}

export default EProductOrdering;
