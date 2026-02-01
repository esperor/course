import InventoryRecordServer from "./inventoryRecordServer";

export interface ProductModelBase {
  id: number;
  storeName: string;
  storeId: number;
  title: string;
  description: string;
}

export default interface ProductRecordServer extends ProductModelBase {
  record: InventoryRecordServer;
}
