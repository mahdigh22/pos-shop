import AuthContext from "@/hooks/authContext";
import {
  List,
  ListItem,
  IconButton,
  ListItemText,
  Button,
  Stack,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  alpha,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useState, useEffect, useContext } from "react";

export default function NewProductSell(props: any) {
  const {
    list,
    total,
    setDeposit,
    Deposit,
    push,
    handleClose,
    setCustomerName,
    CustomerName,
    currency,
  } = props;
  const axios = require("axios");
  const [Customers, setCustomers] = useState([]);
  const [paymentType, setPaymentType] = useState("Cash");

  const { email, token } = useContext(AuthContext);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).value == "Cash") {
      setDeposit(100);
      setCustomerName(null);
    }
    setPaymentType((event.target as HTMLInputElement).value);
  };
  async function getCustomers() {
    try {
      const response = await axios.get(
        "https://shop-server-iota.vercel.app/customers",
        {
          params: { token, email },
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Custom-Header": "foobar",
          },
        }
      );
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }
  useEffect(() => {
    getCustomers();

    // getDataformfirebase();
  }, []);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Bill Total
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mt: 0, mb: 2 }} />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">
              Payment Type:
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={paymentType}
              onChange={handleChange}
              row
            >
              <FormControlLabel
                value="Cash"
                control={<Radio size="small" />}
                label="Cash"
              />
              <FormControlLabel
                value="Deposit"
                control={<Radio size="small" />}
                label="Deposit"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        {paymentType == "Deposit" && (
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Customer Name
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={CustomerName}
                label="Customer Name"
                onChange={(e: any) => {
                  setCustomerName(e.target.value);
                }}
              >
                {Customers?.map((value: any, index: any) => (
                  <MenuItem
                    key={index}
                    value={value.name}
                    disabled={value.status == "Blocked"}
                  >
                    {value.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        <Grid item xs={12}>
          {/* <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          > */}
          <Box
            sx={{
              maxHeight: paymentType == "Deposit" ? 220 : 300,
              overflowY: "auto",
            }}
          >
            {list?.map((value: any, index: any) => (
              <>
                <Stack
                  direction="row"
                  key={index}
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 0.5, backgroundColor: "grey.300", p: 1 }}
                >
                  {" "}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {value.unit}
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {value.name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {" "}
                      {value.sellpricea
                        ? value.sellpricea * value.unit
                        : value.sellpriceb * value.unit}{" "}
                      {currency == "usd" ? "$" : "L.L"}
                    </Typography>
                  </Box>
                </Stack>
                <Divider />
              </>
            ))}
          </Box>

          {paymentType == "Deposit" && (
            <Grid
              item
              xs={12}
              display="flex"
              alignItems="center"
              sx={{ mt: 2 }}
              spacing={2}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mr: 1 }}>
                Pay:
              </Typography>
              <Button
                onClick={() => {
                  setDeposit(0);
                }}
                sx={{ color: "#59a96a" }}
              >
                0%
              </Button>
              <Button
                onClick={() => {
                  setDeposit(25);
                }}
                sx={{ color: "#59a96a" }}
              >
                25%
              </Button>
              <Button
                onClick={() => {
                  setDeposit(75);
                }}
                sx={{ color: "#59a96a" }}
              >
                75%
              </Button>
              <Button
                onClick={() => {
                  setDeposit(100);
                }}
                sx={{ color: "#59a96a" }}
              >
                100%
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider sx={{ mt: 0, mb: 1 }} />
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mr: 1 }}>
              Total Balance:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {total}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ mt: 0, mb: 1 }} />
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center">
            <Typography variant="subtitle1" sx={{ fontWeight: 500, mr: 1 }}>
              Payed Balance:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {(total * Deposit) / 100}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mt: 0, mb: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={() => {
                  push(paymentType);
                }}
                disabled={CustomerName == null && paymentType == "Deposit"}
                sx={{
                  backgroundColor: "#59a96a",
                  ":hover": {
                    backgroundColor: alpha("#59a96a", 0.7),
                  },
                }}
              >
                Buy
              </Button>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{
                  color: "#59a96a",
                  borderColor: "#59a96a",
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
