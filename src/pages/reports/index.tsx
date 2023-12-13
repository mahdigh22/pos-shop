import { Box, Collapse, Grid, IconButton, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import firebaseconf from "@/firebase";
import React, { useContext } from "react";
import AuthContext from "@/hooks/authContext";
import moment from "moment";

function Row(props: any) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  console.log("row", row);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row?.id}
        </TableCell>
        <TableCell>{row?.CustomerName}</TableCell>
        <TableCell>{row?.total}</TableCell>
        <TableCell>{row?.deposit}</TableCell>
        <TableCell
          sx={{ color: row?.returned.return == "true" ? "red" : "#59a96a" }}
        >
          {row?.returned.return == "true" ? "Returned" : "Sold"}
        </TableCell>
        <TableCell align="right">{row?.date}</TableCell>
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

export default function FReports() {
  const axios = require("axios");
  const { email, token, user, type } = useContext(AuthContext);

  const [FReports, setFirebaseReports] = useState<any>([]);
  const [DReports, setDatabaseReports] = useState<any>([]);
  console.log("email", email);
  console.log("user", user);
  React.useEffect(() => {
    getReportsformfirebase();
    // getReportsformDatabase();
  }, []);

  // async function getReportsformDatabase() {
  //   await axios
  //     .get("https://shop-server-iota.vercel.app/reports")
  //     .then((resp: any) => {
  //       setDatabaseReports(resp.data);
  //     });
  // }

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
  console.log("data", data);

  return (
    <Grid container spacing={1} sx={{ p: 1 }}>
      <Grid item xs={12}>
        <Typography variant="h4">Reports</Typography>
      </Grid>
      <Grid item xs={12} sx={{ mt: 4 }}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Deposit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                ?.sort((a, b) => {
                  const dateA = moment(
                    a.date,
                    "dddd, MMMM Do, YYYY h:mm:ss A",
                    true
                  );
                  const dateB = moment(
                    b.date,
                    "dddd, MMMM Do, YYYY h:mm:ss A",
                    true
                  );

                  if (!dateA.isValid() || !dateB.isValid()) {
                    console.log("Invalid date:", a.date);
                    return 0; // Handle invalid dates
                  }

                  return dateB.valueOf() - dateA.valueOf();
                })
                ?.filter((item: any) => {
                  if (type == "admin") {
                    return item.email == email;
                  }
                  return item.email == email && item.user == user;
                })

                ?.map((row: any, index: any) => (
                  <Row key={index} row={row} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
