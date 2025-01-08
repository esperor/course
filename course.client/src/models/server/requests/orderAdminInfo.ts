import Deliverer from "../deliverer";
import OrderInfo from "./orderInfo";

export default interface OrderAdminInfo extends OrderInfo {
  deliverer?: Deliverer;
}