import Layout from "@/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import firebaseconfbackup from "@/firebase-backup";
import { getDatabase, onValue, ref, set } from "firebase/database";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  const axios = require("axios");

  useEffect(() => {
    // Function to make a backup
    const makeBackup = async () => {
      try {
        const db = getDatabase(firebaseconfbackup);
        const d: any = new Date();
        const token =
          typeof window !== "undefined"
            ? // @ts-ignore

              JSON.parse(localStorage.getItem("token"))
            : "";
        const email =
          typeof window !== "undefined"
            ? // @ts-ignore

              JSON.parse(localStorage.getItem("Email"))
            : "";
        const date = moment(d).format("dddd, MMMM Do, YYYY h:mm:ss A");
        const list = await axios.get(
          "https://shop-server-iota.vercel.app/products",
          {
            params: { token, email },
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Custom-Header": "foobar",
            },
          }
        );
        const id = uuidv4();

        set(ref(db, id), {
          list,
          date,

          email,
        });
      } catch (error) {
        console.error("Backup failed:", error);
      }
    };

    // Schedule the backup every 24 hours (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const backupInterval = 24 * 60 * 60 * 1000;
    const backupTimer = setInterval(makeBackup, backupInterval);

    // Initial backup when the app starts
    makeBackup();

    // Clear the interval on component unmount to avoid memory leaks
    return () => clearInterval(backupTimer);
  }, []); // Run this effect only once on component mount
  return (
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
        <Component {...pageProps} />
      </SnackbarProvider>
    </Layout>
  );
}
