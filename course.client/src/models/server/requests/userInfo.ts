import EAccessLevel from "../../accessLevel";

export interface User {
  id: number;
  name: string;
  phone: string;
  accessLevel: EAccessLevel;
  isRegisteredSeller: boolean;
}

export default interface UserInfo {
  isSignedIn: boolean;
  info?: User;
}
