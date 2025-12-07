import { InventoryRecordBase } from "./server/inventoryRecordServer";

export default interface InventoryRecord extends InventoryRecordBase {
  propertiesJson: string;
}