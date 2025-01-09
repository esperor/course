import { useState } from 'react';
import ProductFiltersModel from '../models/productFiltersModel';
import axios from 'axios';
import api from '../api';
import EProductOrdering from '../models/productOrdering';
import constant from '../utils/constants';
import useInfiniteQueryReduced from './useInfiniteQueryReduced';
import ProductRecord from '../models/server/requests/productRecord';
import InventoryRecordServer from '../models/server/inventoryRecordServer';
import InventoryRecord from '../models/inventoryRecord';

const parseRecordProperties = (
  record: InventoryRecordServer,
): InventoryRecord => {
  let properties: { [key: string]: string };
  try {
    properties = JSON.parse(record.propertiesJson ?? '{}');
  } catch (e) {
    properties = { error: 'Failed to parse properties' };
  }
  return {
    ...record,
    properties,
  };
};

const parseProductsRecordsProperties = (products: ProductRecord[]): ProductRecord[] => {
  const productsRecordsRaw = products.map(
    (product) => product.records as InventoryRecordServer[],
  );

  const productsRecordsParsed = productsRecordsRaw.map((records) =>
    records.map(parseRecordProperties),
  );

  const productsProcessed = products.map((product, productIndex) => {
    product.records = productsRecordsParsed[productIndex];
    return product;
  });

  return productsProcessed;
};

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

    return (await axios.get(url)).data;
  };

  const queryReduced = useInfiniteQueryReduced<ProductRecord>({
    queryFn: async (props) => parseProductsRecordsProperties(await fetchProducts(props)),
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
