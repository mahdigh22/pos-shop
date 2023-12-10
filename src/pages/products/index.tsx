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
import { get, getDatabase, onValue, ref, remove, set } from "firebase/database";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import AuthContext from "@/hooks/authContext";

import { useEffect, useState } from "react";
import firebaseconf from "@/firebase";
import { useSnackbar, SnackbarProvider } from "notistack";
import NewProductForm from "@/components/new-product-form";
import Items from "@/components/items";
import firebaseconfbackup from "@/firebase-backup/index";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
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
  const { email, token, type } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [OpenNew, setOpenNew] = useState<boolean>(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [GetData, setGetData] = React.useState<boolean>(false);
  const router = useRouter();
  const [FReports, setFirebaseReports] = useState<any>([]);
  const [FBackUp, setFirebaseBackup] = useState<any>([]);

  const axios = require("axios");

  const [Products, setProducts] = useState<any>([]);
  const [Data, setData] = useState([]);
  const [FireList, setFireList] = useState([]);
  const [Edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClose = () => setOpenNew(false);
  const [Validation, setValidation] = useState<boolean>(true);

  const makeBackup = async () => {
    try {
      const db = getDatabase(firebaseconfbackup);

      // Retrieve data from the Firebase Realtime Database
      const snapshot = await get(ref(db));
      const FBackUp = snapshot.val();

      // Check if it's the first time and there is no backup
      const isFirstTime = !FBackUp || Object.values(FBackUp).length === 0;

      if (isFirstTime) {
        console.log("First time, making backup.");

        // Perform specific logic for the first backup if needed
      } else {
        // Filter the data to get the latest backup within the last 24 hours for a specific email
        const data = Object.values(FBackUp);
        const currentDate = new Date();
        const twentyFourHoursFromNow = new Date();
        twentyFourHoursFromNow.setHours(currentDate.getHours() + 24);
        const latestBackupwithemail = data?.filter(
          (item: any) => item.email === email
        );
        const latestBackup = data
          ?.filter((item: any) => item.email === email)
          ?.filter((item: any) => {
            const parsedDate = moment(
              item?.date,
              "dddd, MMMM Do, YYYY h:mm:ss A"
            ).toDate();
            return parsedDate.getTime() > twentyFourHoursFromNow.getTime();
          });

        if (latestBackupwithemail.length == 0) {
          console.log("fssff");
        }
        // Check if there is no recent backup
        else if (!latestBackup || latestBackup.length === 0) {
          console.log("No recent backup found within the last 24 hours.");
          return;
        }
      }

      // Fetch data from an external API (e.g., list of products)
      const { data: list } = await axios.get(
        "https://shop-server-iota.vercel.app/products",
        {
          params: { token, email },
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Custom-Header": "foobar",
          },
        }
      );

      const id = uuidv4();

      // Assuming 'list' is an array of items

      // Save the new backup to the Firebase Realtime Database
      await set(ref(db, id), {
        list: list?.data,
        date: moment().format("dddd, MMMM Do, YYYY h:mm:ss A"),
        email,
      });

      console.log("Backup successful");
    } catch (error) {
      console.error("Backup failed:", error);
    }
  };

  // Use the effect to run the backup on mount and set up an interval
  useEffect(() => {
    // Initial backup when the app starts

    makeBackup();

    // Schedule the backup every 24 hours (24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const backupInterval = 24 * 60 * 60 * 1000;
    const backupTimer = setInterval(makeBackup, backupInterval);

    // Clear the interval on component unmount to avoid memory leaks
    return () => clearInterval(backupTimer);
  }, []);

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
        ?.filter(
          (item: any) =>
            item?.email == email && `${item?.returned.return}` == "false"
        )
        ?.map((item: any, index: any) => item?.list[index]?.code);
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
      console.log(error);
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
      setValidation(true);
    }
  }
  useEffect(() => {
    setTimeout(() => {
      getProducts();
    }, 500);
  }, []);

  return (
    <>
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
            setOpenSearchModal={false}
          />
        </Grid>
      </Grid>
    </>
  );
}
