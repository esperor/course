import EOrderStatus from "./orderStatus";

export default interface OrderInfo {
  id: number;
  userId: number;
  address: string;
  totalPrice: number;
  date: string;
  status: EOrderStatus;
  orderedRecords: Map<number, number>;
}