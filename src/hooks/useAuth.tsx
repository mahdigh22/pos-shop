import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  name: string;
  // Add any other user properties here
}

interface AuthContextProps {
  user: User | null;
  setUser: any;
  token: any;
  setToken: any;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking if the user is authenticated
    // You might want to replace this with your actual authentication logic
    setTimeout(() => {
      setUser({ name: "John Doe" });
      setIsLoading(false);
    }, 1000);
  }, []);

  const login = () => {
    // Add your login logic here
  };

  const logout = () => {
    // Add your logout logic here
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser,setToken,token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
