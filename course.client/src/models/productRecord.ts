import InventoryRecord from './inventoryRecord';
import ProductRecordServer, {
  ProductRecordBase,
} from './server/productRecordServer';

export default interface ProductRecord extends ProductRecordBase {
  records: InventoryRecord[];
}

export const productRecordFromProductRecordServer = (
  productSrv: ProductRecordServer,
): ProductRecord => {
  return {
    ...productSrv,
    records: productSrv.records.map((recordJson) => ({
      ...recordJson,
      properties: JSON.parse(recordJson.propertiesJson ?? '{}'),
    })),
  } as ProductRecord;
};
