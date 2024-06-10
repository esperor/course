import EAccessLevel from "./accessLevel";

export default interface UserInfo {
  isSignedIn: boolean;
  name?: string;
  phone?: string;
  accessLevel?: EAccessLevel;
}
