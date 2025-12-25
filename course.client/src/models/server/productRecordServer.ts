import InventoryRecordServer from "./inventoryRecordServer";

export interface ProductRecordBase {
  id: number;
  store: string;
  storeId: number;
  title: string;
  description: string;
}

export default interface ProductRecordServer extends ProductRecordBase {
  records: InventoryRecordServer[];
}
