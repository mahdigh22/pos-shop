
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
import { v4 as uuidv4 } from "uuid";

export default function Register() {
  const theme = useTheme();
  const axios = require("axios");
  const router = useRouter();
  const [Loading, setLoading] = useState(false);

  const [Email, setEmail] = useState("");
  const [Pass, setPass] = useState("");
  const [Number, setNumber] = useState();
  const [Name, setName] = useState();
  const id = uuidv4();
  const onlyMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
  const saveEmail = (event: any) => {
    setEmail(event.target.value);
  };
  const saveName = (event: any) => {
    setName(event.target.value);
  };
  const saveNumber = (event: any) => {
    setNumber(event.target.value);
  };
  const savePass = (event: any) => {
    setPass(event.target.value);
  };
  async function Register() {
    setLoading(true);
    if (
      Email.includes(".") ||
      Email.includes("/") ||
      Email.includes("\\") ||
      Email.includes("/0") ||
      Email.includes(" ") ||
      Name == "" ||
      Loading ||
      Pass == ""
    ) {
      () => {};
    } else {
      const resp = await axios.post(
        "https://shop-server-iota.vercel.app/register",
        {
          Email,
          Pass,
          id,
          Name,
          Number,
        }
      );
      console.log("ddd", resp);
      if (resp.data == "found") {
        alert("Username already exist!");
        setLoading(false);
      } else {
        await axios
          .post("https://shop-server-iota.vercel.app/api/auth", {
            Email,
            Pass,
          })
          .then(async function (response: any) {
            console.log(response);
            await axios
              .get("https://shop-server-iota.vercel.app/user/validateToken", {
                params: { token: response?.data },
                headers: {
                  Authorization: `Bearer ${response?.data}`,
                  "X-Custom-Header": "foobar",
                },
              })
              .then(function (response: any) {
                if (response) {
                  localStorage.setItem(
                    "token",
                    JSON.stringify(response.config.params.token)
                  );
                  localStorage.setItem(
                    "Email",
                    JSON.stringify(
                      Email == "222" || Email == "111" ? "" : Email
                    )
                  );

                  router.push("/new-item");
                  setLoading(false);
                  // window.location.reload();
                } else {
                  // navigate('/login');

                  router.push("/");
                  setLoading(false);
                }
              });
          })
          .catch(function (error: any) {
            // navigate('/login');
            setLoading(false);

            alert("Oh wrong Email or Password!");
          });
      }
    }
  }
  return (
    <>
      {" "}
      <Grid
        container
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "95vh" }}
      >
        <Grid item xs={8} md={6} lg={6}>
          <Card sx={{ p: 2, boxShadow: "0" }}>
            <Stack direction="row" justifyContent="center">
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Sign Up
              </Typography>{" "}
            </Stack>
            <Stack direction="row" justifyContent="center">
              <Stack
                direction="column"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{
                  mt: 4,
                  width: { xl: "70%", lg: "70%", md: "80%", xs: "100%" },
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  onChange={saveName}
                />
                <TextField
                  id="outlined-basic"
                  label="User Name"
                  error={
                    Email.includes(".") ||
                    Email.includes("/") ||
                    Email.includes("\\") ||
                    Email.includes("/0") ||
                    Email.includes(" ")
                  }
                  variant="outlined"
                  onChange={saveEmail}
                  fullWidth
                  helperText={
                    Email.includes(".") ||
                    Email.includes("/") ||
                    Email.includes("\\") ||
                    Email.includes("/0") ||
                    Email.includes(" ")
                      ? `UserName should not contain "/", "\" , "\0" , "." , or " " `
                      : ""
                  }
                />

                <TextField
                  id="outlined-basic"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  onChange={saveNumber}
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
                  onClick={Register}
                  fullWidth
                  sx={{
                    backgroundColor: "#59a96a",
                    ":hover": {
                      backgroundColor: alpha("#59a96a", 0.7),
                    },
                  }}
                  disabled={
                    Email.includes(".") ||
                    Email.includes("/") ||
                    Email.includes("\\") ||
                    Email.includes("/0") ||
                    Email.includes(" ") ||
                    Name == "" ||
                    Loading ||
                    Pass == ""
                  }
                >
                  Register
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>
        {onlyMediumScreen && (
          <Grid item xs={6}>
            <Box
              component="img"
              sx={{
                height: "90%",
                width: "90%",
              }}
              alt="The house from the offer."
              src="https://th.bing.com/th/id/OIP.L6U4gFAHK4bGM0l8Nj9hggHaHa?pid=ImgDet&rs=1"
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
