import InventoryRecord from "./inventoryRecord";

export default interface ProductRecord {
  id: number;
  title: string;
  description: string;
  inventoryRecords: InventoryRecord[];
}
