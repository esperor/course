export default interface OrderPostModel {
  address: string;
  orderedRecords: {
    [key: number]: number;
  }[];
}
