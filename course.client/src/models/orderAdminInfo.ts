import Deliverer from "./server/deliverer";
import OrderInfo from "./orderInfo";

export default interface OrderAdminInfo extends OrderInfo {
  deliverer?: Deliverer;
}