import {
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "@/hooks/authContext";
import { enqueueSnackbar } from "notistack";

export default function Setting() {
  const [name, setName] = useState<any>("");
  const [pass, setPass] = useState<any>("");
  const [number, setNumber] = useState<any>("");
  const axios = require("axios");
  const { email, token ,type} = useContext(AuthContext);

  const handleAdd = () => {
    const id = uuidv4();

    axios
      .post("https://shop-server-iota.vercel.app/newUser", {
        id,
        pass,
        name,
        number,
        email,
      })
      .then(function (response: any) {
        if (response.data == "found") {
          enqueueSnackbar("This user is already found", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("User had inserted successfully", {
            variant: "success",
          });
        }
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={6}>
        <Card sx={{ p: 1 }}>Add User</Card>
        <Card sx={{ p: 1, mt: 2 }}>Admin Settings</Card>
        <Card sx={{ p: 1, mt: 2 }}>User Settings</Card>
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
          <Typography> Add User</Typography>
          <TextField
            label=" Name"
            variant="outlined"
            fullWidth
            size="small"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            size="small"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <TextField
            label="Phone number "
            variant="outlined"
            fullWidth
            size="small"
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
          <Stack direction="row">
            <Button variant="contained" onClick={handleAdd}>
              Add User
            </Button>
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
