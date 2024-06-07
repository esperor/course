import InventoryRecord from "./inventoryRecord";

export default interface ProductRecord {
  id: number;
  vendor: string;
  title: string;
  description: string;
  records?: InventoryRecord[];
}
