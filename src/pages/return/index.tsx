import {
  Alert,
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import {
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  push,
  child,
} from "firebase/database";
import firebaseconf from "@/firebase";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import React, { useContext } from "react";
import AuthContext from "@/hooks/authContext";
function Row(props: any) {
  const { email, token } = useContext(AuthContext);

  const { row, setLoading, setOpenSnackbar } = props;
  const axios = require("axios");
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);
  const [loadingReturn, setLoadingReturn] = React.useState(false);
  
  async function UpdateItem(id: any, Data: any) {
    setLoadingReturn(true);

    const list2 = Data?.map((item: any) => ({
      code: item.code,
      quantity: +item.unit,
    }));

    try {
      if (list2.length > 0) {
        const resp = await axios.post(
          "https://shop-server-iota.vercel.app/updateProducts",
          {
            list2,
            email,
          }
        );

        handleDeleteExpense(id, Data);
        setLoadingReturn(false);

        enqueueSnackbar("Bill has been returned", {
          variant: "success",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error contacting server", {
        variant: "error",
      });
      setLoadingReturn(false);
    }
  }

  const handleDeleteExpense = (id: any, Data: any) => {
    const db = getDatabase(firebaseconf);
    setLoading(true);
    const listRef = ref(db, `${id}`);
    const specificItemRef = child(listRef, "returned");

    console.log(listRef);
    const newItem = { return: "true" };
    set(specificItemRef, newItem);

    // remove(ref(db, id));
    setLoading(false);
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row?.id}</TableCell>
        <TableCell>{row?.CustomerName}</TableCell>
        <TableCell>{row?.total}</TableCell>
        <TableCell>{row?.deposit}</TableCell>
        <TableCell>{row?.date}</TableCell>
        <TableCell>
          <Button
            onClick={() => {
              UpdateItem(row?.id, row?.list);
            }}
            disabled={loadingReturn}
          >
            Return
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>code</TableCell>
                    <TableCell>name</TableCell>
                    <TableCell align="right">amount</TableCell>
                    <TableCell align="right">price</TableCell>
                    <TableCell align="right">total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.list?.map((data: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {data.code}
                      </TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell align="right">{data.unit}</TableCell>
                      <TableCell align="right">
                        {data.sellpricea == 0
                          ? data.sellpriceb
                          : data.sellpricea}
                      </TableCell>
                      <TableCell align="right">
                        {(data.sellpricea == 0
                          ? data.sellpriceb
                          : data.sellpricea) * data.unit}
                        {data.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Return() {
  const axios = require("axios");
  const router = useRouter();
  const { email, token } = useContext(AuthContext);

  const [FReports, setFirebaseReports] = useState<any>([]);
  const [DReports, setDatabaseReports] = useState<any>([]);
  const [loading, setLoading] = useState<any>(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  React.useEffect(() => {
    getReportsformfirebase();
    // getReportsformDatabase();
  }, [loading]);

  async function getReportsformDatabase() {
    await axios
      .get("https://shop-server-iota.vercel.app/reports")
      .then((resp: any) => {
        setDatabaseReports(resp.data);
      });
  }

  async function getReportsformfirebase() {
    const db = getDatabase(firebaseconf);
    const starCountRef = ref(db);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setFirebaseReports(data);
    });
  }
  const data = FReports
    ? Object?.keys(FReports)?.map((item: any) => {
        return FReports[item];
      })
    : [];
 
  // useEffect(() => {
  //   if (email !== "222") {
  //     router.push("/reports");
  //   }
  // }, []);
  return (
    <>
      <Grid container spacing={1} sx={{ p: 1 }}>
        <Grid item xs={12}>
          <Typography variant="h4">Reports</Typography>
        </Grid>

        {loading ? (
          <Typography variant="h4">Loading</Typography>
        ) : (
          <Grid item xs={12} sx={{ mt: 4 }}>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Customer Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Deposit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data
                    ?.filter(
                      (item: any) => item.email == email && !item.returned
                    )
                    ?.map((row: any, index: any) => (
                      <Row
                        key={index}
                        row={row}
                        setLoading={setLoading}
                        setOpenSnackbar={setOpenSnackbar}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
    </>
  );
}
