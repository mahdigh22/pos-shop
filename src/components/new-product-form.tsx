import {
  alpha,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { storage } from "@/firebase-backup/index";
import { v4 as uuidv4 } from "uuid";
import { uploadBytesResumable, getDownloadURL, ref } from "firebase/storage";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import React, { useContext } from "react";
import AuthContext from "@/hooks/authContext";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
  const { email, token } = useContext(AuthContext);

  const [Code, setCode] = useState<any>(Data ? Data.code : 0);
  const [Name, setName] = useState<any>(Data ? Data.name : "");
  const [Price, setPrice] = useState<any>(Data ? +Data.price : 0);
  const [loading, setLoading] = useState<any>(false);
  const [progress, setProgress] = useState<any>(0);

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
  const [imgsSrc, setImgsSrc] = useState<any>(Data ? Data.imgsSrc : "");
  const [image, setImage] = useState<File | null>(null);

  const [Quantity, setQuantity] = useState<any>(Data ? +Data.quantity : 0);
  const [Error, setError] = useState<any>(false);
  const id = uuidv4();
  const axios = require("axios");

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
  const handleImageChange = (e: any) => {
    if (e?.target?.files && e?.target?.files?.length > 0) {
      const selectedFile = e?.target?.files[0];
      setImage(selectedFile);
    }
  };

  const handleUpload = () => {
    if (image) {
      const storageRef = ref(storage, `images/${image.name}`);

      // const imageRef = storageRef.child(`files/${image.name}`);

      const uploadTask = uploadBytesResumable(storageRef, image);

      console.log("image", uploadTask);
      setLoading(true);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log(`Upload is ${progress}% done`);
          setProgress(progress);
        },
        (error) => {
          console.error("Error during upload:", error.message);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadURLs) => {
            setImgsSrc(downloadURLs);
            console.log("File available at", downloadURLs);
          });
        }
      );
    } else {
      console.error("No image selected for upload.");
    }
  };

  const handleAdd = () => {
    console.log("imgsSrcimgsSrc", imgsSrc);

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
        imgsSrc,
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
    console.log("imgsSrcimgsSrc", imgsSrc);
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
        imgsSrc,
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <input
              accept="image/*"
              type="file"
              onChange={(event: any) => {
                handleImageChange(event);
              }}
            /> */}
            <Box>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                size="small"
              >
                Choose Image{" "}
                <VisuallyHiddenInput
                  type="file"
                  accept="image/*"
                  onChange={(event: any) => {
                    handleImageChange(event);
                  }}
                />
              </Button>
            </Box>
            <LoadingButton
              size="small"
              color="primary"
              loading={loading && progress != 100 || image == null}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              onClick={handleUpload}
            >
              <span>Save</span>
            </LoadingButton>
            <Typography
              noWrap
              sx={{
                width: "220px",
                color: "grey",
                textDecoration: "underline",
              }}
              href={imgsSrc}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
            >
              {imgsSrc}
            </Typography>

            {/* <Button variant="outlined" size="small" onClick={handleUpload}>
              upload
            </Button> */}
          </Box>
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
