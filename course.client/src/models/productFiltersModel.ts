import EProductOrdering from './productOrdering';

interface ProductFiltersModel {
  limit: number;
  ordering: EProductOrdering;
  search: string | null;
  storeId: number | null;
}

export default ProductFiltersModel;
