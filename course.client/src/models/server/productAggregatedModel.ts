import InventoryRecordServer from "./inventoryRecordServer";
import { ProductModelBase } from "./productRecordServer";

export default interface ProductAggregatedModel extends ProductModelBase {
  records?: InventoryRecordServer[];
}
