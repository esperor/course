import EOrderStatus from "./orderStatus";

export default interface Order {
  id: number;
  userId: number;
  address: string;
  date: string;
  status: EOrderStatus;
  orderedRecords: Map<number, number>;
}