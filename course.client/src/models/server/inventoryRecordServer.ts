export interface InventoryRecordBase {
  id: number;
  quantity: number;
  size?: string;
  variation: string;
  price: number;
  image?: Uint8Array;
}
export default interface InventoryRecordServer extends InventoryRecordBase {
  propertiesJson?: string;
}
