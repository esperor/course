import { useCallback, useEffect, useState } from 'react';
import ProductFiltersModel from '../models/productFiltersModel';
import axios from 'axios';
import api from '../api';
import EProductOrdering from '../models/productOrdering';
import constant from '../utils/constants';
import useInfiniteQueryReduced from './useInfiniteQueryReduced';
import ProductRecord from '../models/productRecord';
import InventoryRecordServer from '../models/server/inventoryRecordServer';
import InventoryRecord from '../models/inventoryRecord';
import { useQueryClient } from '@tanstack/react-query';
import ProductRecordServer from '../models/server/productRecordServer';

const parseRecordProperties = (
  record: InventoryRecordServer,
): InventoryRecord => {
  let properties: { [key: string]: string };
  try {
    properties = record.propertiesJson ? JSON.parse(record.propertiesJson) : undefined;
  } catch (e) {
    properties = { error: 'Failed to parse properties' };
  }
  return {
    ...record,
    properties,
  };
};

const parseProductsRecordsProperties = (
  products: ProductRecordServer[],
): ProductRecord[] => {
  return products.map((product) => {
    const recordParsed = product.record ? parseRecordProperties(product.record) : undefined;
    return {
      ...product,
      record: recordParsed,
      uniqueId: `${product.id}${recordParsed?.id ? `.${recordParsed.id}` : ''}`,
    };
  });
};

const useProducts = (searchParams?: {
  limit?: number;
  ordering?: number;
  search?: string;
  storeId?: number;
}) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ProductFiltersModel>({
    limit: constant.defaultLimit,
    ordering: EProductOrdering.None,
    search: searchParams?.search ?? null,
    storeId: searchParams?.storeId ?? null,
  });

  useEffect(() => {
    if (!searchParams) return;
    if (searchParams.limit) setFilters(prev => ({ ...prev, limit: searchParams.limit as number }));
    if (searchParams.ordering !== undefined) setFilters(prev => ({ ...prev, ordering: searchParams.ordering as EProductOrdering }));
    if (searchParams.search) setFilters(prev => ({ ...prev, search: searchParams.search as string }));
    if (searchParams.storeId) setFilters(prev => ({ ...prev, storeId: searchParams.storeId as number }));

    queryClient.invalidateQueries({ queryKey: ['products', searchParams?.storeId] });
  }, [searchParams, queryClient]);

  const fetchProducts = useCallback(async ({ pageParam }: { pageParam: unknown }) => {
    let url = `/${api.public.product.getAll}?offset=${(pageParam as number) * filters.limit}&limit=${filters.limit}`;
    if (filters.search != null) url += `&searchString=${filters.search}`;
    if (filters.ordering != EProductOrdering.None)
      url += `&orderBy=${filters.ordering}`;
    if (filters.storeId) url += `&storeId=${filters.storeId}`;

    return (await axios.get(url)).data;
  }, [filters]);

  const queryReduced = useInfiniteQueryReduced<ProductRecord>({
    queryFn: async (props) => parseProductsRecordsProperties(await fetchProducts(props)),
    queryKey: ['products', searchParams?.storeId],
    limit: filters.limit,
  });

  useEffect(() => {
    const search: Record<string, string> = {
      limit: filters.limit.toString(),
      ordering: filters.ordering.toString(),
    };

    if (filters.search != null) search.search = filters.search;
    if (filters.storeId != null) search.storeId = filters.storeId.toString();

    history.replaceState({}, '', `?${new URLSearchParams(search)}`);
  }, [filters]);

  return {
    filters,
    setFilters,
    ...queryReduced,
  };
};

export default useProducts;
