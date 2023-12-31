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
  const [pass, setPass] = useState<any>(null);
  const [type, setType] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [lbpValue, setLbpValue] = useState<any>(100000);
  const [isLoading, setIsLoading] = useState(true);
  const axios = require("axios");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const storedToken = await localStorage.getItem("token");
      const storedEmail = await localStorage.getItem("Email");
      const storedType = await localStorage.getItem("type");
      const storedUser = await localStorage.getItem("user");
      const storedCurrency = await localStorage.getItem("currency");

      if (
        storedToken != null &&
        storedEmail != null &&
        storedType != null &&
        storedUser != null &&
        storedCurrency != null
      ) {
        // Data found in localStorage, set authentication state

        setEmail(storedEmail.replace(/^"(.*)"$/, "$1"));
        setUser(storedUser.replace(/^"(.*)"$/, "$1"));
        setToken(storedToken.replace(/^"(.*)"$/, "$1"));
        setType(storedType.replace(/^"(.*)"$/, "$1"));
        setLbpValue(+storedCurrency.replace(/^"(.*)"$/, "$1"));
      }
      if (storedEmail == null || storedToken == null) {
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
          params: { token: response?.data.token },
          headers: {
            Authorization: `Bearer ${response?.data?.token}`,
            "X-Custom-Header": "foobar",
          },
        }
      );

      if (validateResponse) {
        setUser(email);
        if (response.data.type == "admin") {
          setEmail(email === "222" || email === "111" ? "" : email);
        } else {
          setEmail(
            response?.data?.info?.name === "222" ||
              response?.data?.info?.name === "111"
              ? ""
              : response?.data?.info?.name
          );
        }
        setPass(pass);

        setType(response.data.type);
        setToken(validateResponse.config.params.token);
        localStorage.setItem("user", JSON.stringify(email));
        localStorage.setItem(
          "token",
          JSON.stringify(validateResponse.config.params.token)
        );
        localStorage.setItem("type", JSON.stringify(response.data.type));
        if (response.data.type == "admin") {
          localStorage.setItem(
            "Email",
            JSON.stringify(email === "222" || email === "111" ? "" : email)
          );
        } else {
          localStorage.setItem(
            "Email",
            JSON.stringify(
              response?.data?.info?.name === "222" ||
                response?.data?.info?.name === "111"
                ? ""
                : response?.data?.info?.name
            )
          );
        }

        router.push("/products");
      } else {
        // Handle the case when validation fails
        router.push("/");
      }
    } catch (error) {
      // Handle errors here
      alert("Oh wrong Email or Password!");
    }
  };

  const remove = async () => {
    setToken(null);
    setEmail(null);
  };

  const ChangeCurrency = async (value: any) => {
    setLbpValue(+value);
    localStorage.setItem("currency", JSON.stringify(value));
  };
  const register = async (userData: any) => {
    const { emailData, PassData, id, Name, Number } = userData;

    const resp = await axios.post(
      "https://shop-server-iota.vercel.app/register",
      {
        emailData,
        PassData,
        id,
        Name,
        Number,
      }
    );
    console.log("ddd", resp);
    if (resp.data == "found") {
      alert("Username already exist!");
    } else {
      const response = await axios.post(
        "https://shop-server-iota.vercel.app/api/auth",
        {
          Email: emailData,
          Pass: PassData,
        }
      );

      const validateResponse = await axios.get(
        "https://shop-server-iota.vercel.app/user/validateToken",
        {
          params: { token: response?.data.token },
          headers: {
            Authorization: `Bearer ${response?.data?.token}`,
            "X-Custom-Header": "foobar",
          },
        }
      );

      if (validateResponse) {
        if (response.data.type == "admin") {
          setEmail(emailData === "222" || emailData === "111" ? "" : emailData);
        } else {
          setEmail(
            response?.data?.info?.name === "222" ||
              response?.data?.info?.name === "111"
              ? ""
              : response?.data?.info?.name
          );
        }
        setPass(PassData);
        setType(response.data.type);
        setToken(validateResponse.config.params.token);
        localStorage.setItem(
          "token",
          JSON.stringify(validateResponse.config.params.token)
        );
        localStorage.setItem("type", JSON.stringify(response.data.type));
        if (response.data.type == "admin") {
          localStorage.setItem(
            "Email",
            JSON.stringify(
              emailData === "222" || emailData === "111" ? "" : emailData
            )
          );
        } else {
          localStorage.setItem(
            "Email",
            JSON.stringify(
              response?.data?.info?.name === "222" ||
                response?.data?.info?.name === "111"
                ? ""
                : response?.data?.info?.name
            )
          );
        }

        router.push("/products");
      } else {
        // Handle the case when validation fails
        router.push("/");
      }
    }
  };

  const logout = () => {
    setToken(null);
    router.push("/");
  };
  if (isLoading) {
    // Return a loading page or spinner while data is being fetched
    return <div>Loading...</div>;
  }
  return (
    <AuthContext.Provider
      value={{
        email,
        token,
        login,
        logout,
        type,
        register,
        pass,
        isLoading,
        user,
        remove,
        ChangeCurrency,
        lbpValue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
