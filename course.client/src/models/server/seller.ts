interface Seller {
  userId: number;
  name: string;
  phone: string;
  email: string;
  contractNumber: string;
  active: boolean;
  freezed: boolean;
  suspended: boolean;
}

export default Seller;