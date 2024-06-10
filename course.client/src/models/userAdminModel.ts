import EAccessLevel from "./accessLevel";

export default interface UserAdminInfo {
  id: number;
  name: string;
  phone: string;
  accessLevel: EAccessLevel;
}
