import {
  alpha,
  Box,
  Button,
  Card,
  Grid,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import firebaseconf from "@/firebase";
import { useSnackbar, SnackbarProvider } from "notistack";
import NewProductForm from "@/components/new-product-form";
import Items from "@/components/items";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: 4,
  boxShadow: 24,
  p: 2,
};
export default function NewItem(props: any) {
  const { enqueueSnackbar } = useSnackbar();

  const [OpenNew, setOpenNew] = useState<boolean>(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [GetData, setGetData] = React.useState<boolean>(false);
  const router = useRouter();
  const [FReports, setFirebaseReports] = useState<any>([]);

  const axios = require("axios");

  const [Products, setProducts] = useState<any>([]);
  const [Data, setData] = useState([]);
  const [FireList, setFireList] = useState([]);
  const [Edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClose = () => setOpenNew(false);
  const [Validation, setValidation] = useState<boolean>(true);

  const token =
    typeof window !== "undefined"
      ? // @ts-ignore

        JSON.parse(localStorage.getItem("token"))
      : "";
  const email =
    typeof window !== "undefined"
      ? // @ts-ignore

        JSON.parse(localStorage.getItem("Email"))
      : "";

  const handleRoute = (path: any) => {
    router.push(path);
  };
  useEffect(() => {
    if (Validation == false) {
      router.push("/");
    }
  }, [Validation]);

  async function DeleteItem(code: any) {
    try {
      // setLoading(true);
      const db = getDatabase(firebaseconf);
      const starCountRef = ref(db);
      let storedValue: any;
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        storedValue = data; // Assign the value to the variable
      });

      const data2 = Object?.keys(storedValue)
        ?.map((item: any) => storedValue[item])
        ?.filter((item: any) => item.email == email)
        ?.map((item: any, index: any) => item.list[index].code);

      if (data2.includes(code)) {
        enqueueSnackbar("This product is found in return page", {
          variant: "error",
        });

        // console.log("nnn");
      } else {
        setLoading(true);
        const response = await axios.post(
          "https://shop-server-iota.vercel.app/Deleteproducts",
          {
            code,
            email,
          }
        );
        setGetData(!GetData);

        setLoading(false);
        // console.log("ddd");
        enqueueSnackbar("Product deleted successfully", {
          variant: "success",
        });
        getProducts();
      }
    } catch (error) {
      enqueueSnackbar("Error deleting item", {
        variant: "error",
      });
      setLoading(false);
    }
  }
  async function getItemsSearch(event: any) {
    try {
      if (event.length > 0) {
        setLoading(true);
        const response = await axios.get(
          "https://shop-server-iota.vercel.app/Searchproducts",
          {
            params: { event, token, email },
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Custom-Header": "foobar",
            },
          }
        );

        setProducts(response.data.data || []);
        setLoading(false);
        setValidation(true);
      } else {
        getProducts();
      }
    } catch (error) {
      setValidation(false);
      console.error("Error fetching items:", error);
    }
  }
  // async function getDataformfirebase() {
  //   const db = getDatabase(firebaseConf);
  //   const starCountRef = ref(db);
  //   onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setFireList(data);
  //   });
  // }
  // const data2 = FireList
  // ? Object?.keys(FireList)?.map((item: any) => {
  //     return FireList[item];
  //   })
  // : [];
  // console.log(data2);
  async function getProducts() {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://shop-server-iota.vercel.app/products",
        {
          params: { token, email },
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Custom-Header": "foobar",
          },
        }
      );
      setProducts(response.data.data);
      setLoading(false);
      setValidation(true);
    } catch (error) {
      setGetData(!GetData);
      setValidation(false);
    }
  }
  useEffect(() => {
    getProducts();
    // getDataformfirebase();
  }, []);

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Modal
        open={OpenNew}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewProductForm
            handleClose={handleClose}
            setGetData={setGetData}
            GetData={GetData}
            Products={Products}
            getProducts={getProducts}
            isEdit={false}
            Data={[]}
          />
        </Box>
      </Modal>
      <Modal
        open={Edit}
        onClose={() => {
          setEdit(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewProductForm
            handleClose={() => {
              setEdit(false);
            }}
            setGetData={setGetData}
            GetData={GetData}
            Products={Products}
            isEdit={true}
            Data={Data}
            getProducts={getProducts}
          />
        </Box>
      </Modal>
      <Grid container sx={{ pt: 1 }}>
        <Grid item xs={12} sm={5} lg={7}>
          <Button
            variant="contained"
            onClick={() => {
              setOpenNew(true);
            }}
            sx={{
              backgroundColor: "#59a96a",
              ":hover": {
                backgroundColor: alpha("#59a96a", 0.7),
              },
            }}
          >
            New Item
          </Button>
        </Grid>
        <Grid item xs={12} sm={7} lg={5} sx={{ p: 1 }}>
          <TextField
            id="outlined-basic"
            label="Search using code "
            variant="outlined"
            size="small"
            fullWidth
            onChange={(event: any) => {
              getItemsSearch(event.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Items
            Products={Products}
            setData={setData}
            DeleteItem={DeleteItem}
            loading={loading}
            setEdit={setEdit}
          />
        </Grid>
      </Grid>
    </SnackbarProvider>
  );
}
