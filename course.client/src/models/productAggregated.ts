import InventoryRecord from './inventoryRecord';
import ProductAggregatedModel from './server/productAggregatedModel';
import {
  ProductModelBase,
} from './server/productRecordServer';

export default interface ProductAggregated extends ProductModelBase {
  records: InventoryRecord[];
}

export const productAggregatedFromProductAggregatedModel = (
  productSrv: ProductAggregatedModel,
): ProductAggregated => {
  return {
    ...productSrv,
    records: productSrv.records?.map((recordJson) => ({
      ...recordJson,
      properties: JSON.parse(recordJson.propertiesJson ?? '{}'),
    })),
  } as ProductAggregated;
};
