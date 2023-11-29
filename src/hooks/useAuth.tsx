import { useRouter } from "next/router";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AuthContext from "./authContext";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<any | null>(null);
  const [token, setToken] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const axios = require("axios");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = await localStorage.getItem("token");
      const storedEmail = await localStorage.getItem("Email");

      if (storedToken && storedEmail) {
        // Data found in localStorage, set authentication state

        setEmail(storedEmail);
        setToken(storedToken);
      }
      if (email == null && token == null) {
        logout();
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);
  const login = async (userData: any) => {
    const { email, pass } = userData;

    try {
      const response = await axios.post(
        "https://shop-server-iota.vercel.app/api/auth",
        {
          Email: email,
          Pass: pass,
        }
      );

      const validateResponse = await axios.get(
        "https://shop-server-iota.vercel.app/user/validateToken",
        {
          params: { token: response?.data },
          headers: {
            Authorization: `Bearer ${response?.data}`,
            "X-Custom-Header": "foobar",
          },
        }
      );

      if (validateResponse) {
        setEmail(email === "222" || email === "111" ? "" : email);
        setToken(validateResponse.config.params.token);
        localStorage.setItem(
          "token",
          JSON.stringify(validateResponse.config.params.token)
        );
        localStorage.setItem(
          "Email",
          JSON.stringify(email === "222" || email === "111" ? "" : email)
        );
        setIsLoading(false);
        router.push("/products");
      } else {
        // Handle the case when validation fails
        router.push("/");
      }
    } catch (error) {
      // Handle errors here
      setIsLoading(false);
      alert("Oh wrong Email or Password!");
    }
  };

  const logout = () => {
    setToken(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
