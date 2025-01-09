import InventoryRecord from "./inventoryRecord";

export default interface CartProductRecord extends InventoryRecord {
  serverQuantity: number;
  productId: number;
  description: string;
}