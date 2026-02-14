import InventoryRecord from "./inventoryRecord";
import { ProductModelBase } from "./server/productRecordServer";

export default interface ProductRecord extends ProductModelBase {
  record?: InventoryRecord;
  uniqueId: string;
}