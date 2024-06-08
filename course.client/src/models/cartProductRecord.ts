export default interface CartProductRecord {
  recordId: number;
  quantity: number;
  serverQuantity: number;
  size: string;
  price: number;
  image: Uint8Array;
  productId: number;
  title: string;
  description: string;
}