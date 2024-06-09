import EProductOrdering from './productOrdering';

interface ProductFiltersModel {
  limit: number;
  ordering: EProductOrdering;
  search: string | null;
}

export default ProductFiltersModel;
