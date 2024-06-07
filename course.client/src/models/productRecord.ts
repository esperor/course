import InventoryRecord from "./inventoryRecord";

export default interface ProductRecord {
  id: number;
  vendorId: number;
  title: string;
  description: string;
  records?: InventoryRecord[];
}
