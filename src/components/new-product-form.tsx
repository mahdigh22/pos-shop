

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
import { getDatabase, ref, set, update } from "firebase/database";
import { useState } from "react";

import { v4 as uuidv4 } from "uuid";

export default function NewProductForm(props: any) {
  const {
    handleClose,
    setGetData,
    GetData,
    isEdit,
    Data,
    getProducts,
    Products,
  } = props;
  console.log("data", Data);
  const [Code, setCode] = useState<any>(Data ? Data.code : 0);
  const [Name, setName] = useState<any>(Data ? Data.name : "");
  const [Price, setPrice] = useState<any>(Data ? +Data.price : 0);
  const [SellPrice1, setSellPrice1] = useState<any>(
    Data ? +Data.sellpricea : 0
  );
  const [SellPrice2, setSellPrice2] = useState<any>(
    Data ? +Data.sellpriceb : 0
  );
  const [Category, setCategory] = useState<any>(Data ? Data.category : "");
  const [Unit, setUnit] = useState<any>(Data ? +Data.unit : 1);
  const [Supplier, setSupplier] = useState<any>(Data ? Data.supplier : "");
  const [Currency, setCurrency] = useState<any>(Data ? Data.currency : "$");
  const [Quantity, setQuantity] = useState<any>(Data ? +Data.quantity : 0);
  const [Error, setError] = useState<any>(false);
  const id = uuidv4();
  const axios = require("axios");
  const email =
    typeof window !== "undefined"
      ? // @ts-ignore

        JSON.parse(localStorage.getItem("Email"))
      : "";

  const list = [
    {
      Code: Code,
      Name: Name,
      Price: Price,
      SellPrice1: SellPrice1,
      SellPrice2: SellPrice2,
      Category: Category,
      Supplier: Supplier,
      Currency: Currency,
      Quantity: Quantity,
      Unit: Unit,
    },
  ];
  // const handleAdd2 = () => {
  //   const db = getDatabase(firebaseConf);
  //   const id = uuidv4();
  //   const d: any = new Date();

  //   const date = moment(d).format("dddd, MMMM Do, YYYY h:mm:ss A");

  //   set(
  //     ref(
  //       db,

  //       id
  //     ),
  //     {
  //       list,
  //       date,
  //       id,
  //     }
  //   );
  // };
  const handleAdd = () => {
    axios
      .post("https://shop-server-iota.vercel.app/newproduct", {
        id,
        Code,
        Name,
        Price,
        SellPrice1,
        SellPrice2,
        Category,
        Supplier,
        Currency,
        Quantity,
        Unit,
        email,
      })
      .then(function (response: any) {
        handleClose();
        getProducts();

        setGetData(!GetData);
      })
      .catch(function (error: any) {
        console.log(error);
      });
    setGetData(true);
  };

  const handleEdit = () => {
    // const db = getDatabase(firebaseConf);
    // const id =  Data?.id;
    // const d: any = new Date();

    // const date = moment(d).format("dddd, MMMM Do, YYYY h:mm:ss A");

    // update(
    //   ref(
    //     db,

    //     Data?.id
    //   ),
    //   {
    //     list,
    //     date,
    //     id,
    //   }
    // );
    axios
      .put("https://shop-server-iota.vercel.app/updateproduct", {
        // id,
        Code,
        Name,
        Price,
        SellPrice1,
        SellPrice2,
        Category,
        Supplier,
        Currency,
        Quantity,
        Unit,
        email,
      })
      .then(function (response: any) {
        console.log(response);
        getProducts();
        handleClose();
        setGetData(!GetData);
      })
      .catch(function (error: any) {
        console.log(error);
      });
    setGetData(true);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">New Product</Typography>
          <Divider sx={{ mt: 2 }} />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Code"
            variant="outlined"
            fullWidth
            error={Error}
            helperText={Error ? "Code Already Exist" : ""}
            value={Code}
            disabled={isEdit}
            onChange={(e) => {
              if (Products.find((o: any) => o.code === e.target.value)) {
                setCode(e.target.value);

                setError(true);
              } else {
                setCode(e.target.value);
                setError(false);
              }
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label=" Name"
            variant="outlined"
            fullWidth
            value={Name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            type="number"
            value={Price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Currency</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Currency}
              label="Currency"
              onChange={(e) => {
                setCurrency(e.target.value);
              }}
            >
              <MenuItem value={"usd"}>Dollar</MenuItem>
              <MenuItem value={"lbp"}>L.L</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Sell Price 1"
            type="number"
            variant="outlined"
            value={SellPrice1}
            fullWidth
            onChange={(e) => {
              setSellPrice1(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Sell Price 2"
            type="number"
            variant="outlined"
            value={SellPrice2}
            fullWidth
            onChange={(e) => {
              setSellPrice2(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Quantity"
            type="number"
            variant="outlined"
            value={Quantity}
            fullWidth
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Supplier"
            variant="outlined"
            value={Supplier}
            fullWidth
            onChange={(e) => {
              setSupplier(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Category"
            variant="outlined"
            value={Category}
            fullWidth
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Unit"
            variant="outlined"
            value={Unit}
            type="number"
            fullWidth
            onChange={(e) => {
              setUnit(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              onClick={isEdit ? handleEdit : handleAdd}
              disabled={Error && !isEdit}
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
