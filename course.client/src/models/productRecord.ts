import InventoryRecord from "./inventoryRecord";
import { ProductModelBase } from "./server/productRecordServer";

export default interface ProductRecordServer extends ProductModelBase {
  record: InventoryRecord;
}