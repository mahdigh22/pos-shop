import * as React from "react";
import Navbar from "./navbar";
import { Grid } from "@mui/material";

export default function LoginLayout({ children }: { children: any }) {
  return (
    <Grid container sx={{ backgroundColor: "white" }}>
      <Grid item xs={12} sx={{ height: "100vh" }}>
        {children}
      </Grid>
    </Grid>
  );
}
