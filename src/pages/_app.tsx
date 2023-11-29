import Layout from "@/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { useEffect,useContext } from "react";
import firebaseconfbackup from "@/firebase-backup";
import { getDatabase, onValue, ref, set } from "firebase/database";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import AuthProvider from "@/hooks/useAuth";
import AuthContext from "@/hooks/authContext";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;

  return (
    <AuthProvider>
      <Layout
        type={
          pathname == "/" || pathname == "/login" || pathname == "/register"
            ? "login"
            : ""
        }
      >
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Component {...pageProps} />{" "}
        </SnackbarProvider>
      </Layout>{" "}
    </AuthProvider>
  );
}
