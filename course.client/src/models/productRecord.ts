import InventoryRecord from "./inventoryRecord";

export default interface ProductRecord {
  id: number;
  vendor: string;
  vendorId: number;
  title: string;
  description: string;
  records?: InventoryRecord[];
}
