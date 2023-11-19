import * as React from "react";
import Navbar from "./navbar";
import { Grid } from "@mui/material";
import LoginLayout from "./login-layout";

export default function Layout({
  children,
  type,
}: {
  children: any;
  type?: any;
}) {
  if (type != "login") {
    return (
      <Grid container sx={{ backgroundColor: "white" }}>
        <Grid item xs={12} sx={{ height: "10vh" }}>
          <Navbar />
        </Grid>
        <Grid item xs={12} sx={{ height: "90vh" }}>
          {children}
        </Grid>
      </Grid>
    );
  } else {
    return <LoginLayout>{children}</LoginLayout>;
  }
}
