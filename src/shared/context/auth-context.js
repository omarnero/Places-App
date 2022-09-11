import { createContext } from "react";

export const AuthContext = createContext({
  isLogdedIn: false,
  userId: null,
  token: null,
  Login() {},
  Logout() {},
});
