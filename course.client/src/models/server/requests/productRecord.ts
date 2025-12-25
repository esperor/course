import InventoryRecord from "../../inventoryRecord";

export default interface ProductRecord {
  id: number;
  store: string;
  storeId: number;
  title: string;
  description: string;
  records: InventoryRecord[];
}
