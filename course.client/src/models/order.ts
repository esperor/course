export default interface Order {
  address: string;
  orderedRecords: {
    [key: number]: number;
  }[];
}
