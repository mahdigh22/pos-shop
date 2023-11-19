import Layout from "@/layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { pathname } = router;
  console.log("dddd", pathname);
  return (
    <Layout
      type={
        pathname == "/" || pathname == "/login" || pathname == "/register"
          ? "login"
          : ""
      }
    >
      <Component {...pageProps} />
    </Layout>
  );
}
