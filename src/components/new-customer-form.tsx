import {
  alpha,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import React, { useContext } from "react";
import AuthContext from "@/hooks/authContext";
import { v4 as uuidv4 } from "uuid";
export default function NewCustomerForm(props: any) {
  const { email, token, type } = useContext(AuthContext);
  const { getCustomers, handleClose, edit, rowData } = props;
  const [name, setName] = useState<any>(edit ? rowData.name : "");
  const [number, setNumber] = useState<any>(edit ? rowData.number : 0);
  const [payedBalance, setPayedBalance] = useState<number>(0);
  const [country, setCountry] = useState<any>(edit ? rowData.country : "");
  const [status, setStatus] = useState<any>(edit ? rowData.status : "");
  const [id, setId] = useState<any>(edit ? rowData._id : uuidv4());
  const axios = require("axios");
  console.log("rowData", rowData);

  const handleAdd = () => {
    edit
      ? axios
          .post("https://shop-server-iota.vercel.app/updateCustomer", {
            rowData,
            id,
            name,
            number,
            country,
            status,
            payedBalance,
            email,
          })
          .then(function (response: any) {
            getCustomers();
            handleClose();
          })
          .catch(function (error: any) {
            console.log(error);
          })
      : axios
          .post("https://shop-server-iota.vercel.app/newCustomer", {
            id,
            name,
            number,
            country,
            status,
            email,
          })
          .then(function (response: any) {
            getCustomers();
            handleClose();
          })
          .catch(function (error: any) {
            console.log(error);
          });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">New Customer</Typography>
          <Divider sx={{ mt: 2 }} textAlign="right">
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "gray" }}
            >
              Balance: {edit && +rowData.balance}
            </Typography>
          </Divider>
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Number"
            variant="outlined"
            fullWidth
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Country"
            variant="outlined"
            fullWidth
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
          />
        </Grid>
        {edit && (
          <Grid item xs={6}>
            <TextField
              label="Pay Amount"
              variant="outlined"
              fullWidth
              type="number"
              value={payedBalance}
              onChange={(e) => {
                setPayedBalance(+e.target.value);
              }}
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="Stauts"
              disabled={type != "admin"}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
            >
              <MenuItem value={"Blocked"}>Blocked</MenuItem>
              <MenuItem value={"Accepted"}>Accepted</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={
                name == "" || number == "" || country == "" || status == ""
              }
              sx={{
                backgroundColor: "#59a96a",
                ":hover": {
                  backgroundColor: alpha("#59a96a", 0.7),
                },
              }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={handleClose}
              sx={{ color: "#59a96a", borderColor: "#59a96a" }}
            >
              Cancel
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
