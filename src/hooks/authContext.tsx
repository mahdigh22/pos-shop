// authContext.ts
import { createContext, ReactNode } from "react";

interface AuthContextProps {
  email: any;
  setEmail: any;
  token?: any;
  setToken?: any;
  isLoading?: boolean;
  login?: any;
  register?: any;
  type?: any;
  user?: any;
  pass?: any;
  lbpValue?: any;
  logout?: () => void;
  remove?: () => void;
  ChangeCurrency?: () => void;
}

const AuthContext = createContext<any | undefined>(undefined);

export default AuthContext;
