import React, { useContext } from "react";

import AuthContext from "@/hooks/authContext";
import {
  Grid,
  Card,
  TextField,
  Stack,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  alpha,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const { login } = useContext(AuthContext) || {};

  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);
  const theme = useTheme();
  const axios = require("axios");
  const [Email, setEmail] = useState();
  const [Pass, setPass] = useState();

  const onlyMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();

  const saveEmail = (event: any) => {
    setEmail(event.target.value);
  };
  const savePass = (event: any) => {
    setPass(event.target.value);
  };

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);
  async function CheckIfValid() {
    await login({ email: Email, pass: Pass });
  }

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item xs={8} md={6} lg={6}>
        <Card sx={{ p: 2, boxShadow: "0", height: "100%", width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <Stack direction="row" justifyContent="center">
              <Typography variant="h4">Hello Please Login </Typography>{" "}
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              sx={{ width: "70%" }}
            >
              <Stack
                direction="column"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{
                  mt: 4,
                  width: { xl: "100%", lg: "100%", md: "80%", xs: "100%" },
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="User Name"
                  variant="outlined"
                  onChange={saveEmail}
                  fullWidth
                />

                <TextField
                  id="outlined-basic"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  onChange={savePass}
                />
                <Button
                  variant="contained"
                  onClick={CheckIfValid}
                  disabled={Loading}
                  fullWidth
                  sx={{
                    backgroundColor: "#59a96a",
                    ":hover": {
                      backgroundColor: alpha("#59a96a", 0.7),
                    },
                  }}
                >
                  Login
                </Button>
                <Typography>
                  Do not have an account?
                  <Button
                    sx={{ fontWeight: 600, color: "#59a96a" }}
                    onClick={() => {
                      router.push("/register");
                    }}
                  >
                    Sign Up
                  </Button>{" "}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Card>
      </Grid>
      {onlyMediumScreen && (
        <Grid item xs={6}>
          <Card
            sx={{
              height: "100%",
              boxShadow: "0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              alt="The house from the offer."
              src="https://th.bing.com/th/id/OIP.L6U4gFAHK4bGM0l8Nj9hggHaHa?pid=ImgDet&rs=1"
            />
          </Card>
        </Grid>
      )}
    </Grid>
  );
}
