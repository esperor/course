import { useState } from 'react';
import ProductFiltersModel from '../models/productFiltersModel';
import axios from 'axios';
import api from '../api';
import EProductOrdering from '../models/productOrdering';
import constant from '../utils/constants';
import useInfiniteQueryReduced from './useInfiniteQueryReduced';
import ProductRecord from '../models/server/requests/productRecord';

const useProducts = () => {
  const [filters, setFilters] = useState<ProductFiltersModel>({
    limit: constant.defaultLimit,
    ordering: EProductOrdering.None,
    search: null,
  });

  const fetchProducts = async ({ pageParam }: { pageParam: unknown }) => {
    let url = `${api.product.rest}?offset=${(pageParam as number) * filters.limit}&limit=${filters.limit}`;
    if (filters.search != null) url += `&searchString=${filters.search}`;
    if (filters.ordering != EProductOrdering.None)
      url += `&orderBy=${filters.ordering}`;
    const res = await axios.get(url);
    return res.data;
  };

  const queryReduced = useInfiniteQueryReduced<ProductRecord>({
    queryFn: fetchProducts,
    queryKey: ['products'],
    limit: filters.limit,
  });

  return {
    filters,
    setFilters,
    ...queryReduced,
  };
};

export default useProducts;
