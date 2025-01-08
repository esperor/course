export default interface InventoryRecord {
  id: number;
  quantity: number;
  size: string;
  price: number;
  image: Uint8Array;
  title: string;
  propertiesJson: string;
}