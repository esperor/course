import { InventoryRecordBase } from "./server/inventoryRecordServer";

export default interface InventoryRecord extends InventoryRecordBase {
  properties: { [key: string]: string };
}