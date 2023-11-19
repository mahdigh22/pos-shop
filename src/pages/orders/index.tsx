import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  Collapse,
  Grid,
  IconButton,
  Slider,
  Snackbar,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useRef, useState } from "react";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Router } from "next/router";
import { useRouter, usePathname } from "next/navigation";
import {
  SnackbarProvider,
  VariantType,
  useSnackbar,
  enqueueSnackbar,
} from "notistack";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import moment from "moment";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
export default function Orders() {
  const [page, setPage] = React.useState(0);
  const [event, setEvent] = useState<any>("");

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [Products, setProducts] = useState<any>([]);
  const [Orders, setOrders] = useState<any>([]);
  const [Validation, setValidation] = useState<boolean>(true);
  const router = useRouter();
  const id = uuidv4();

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

  const axios = require("axios");

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const DeleteItem = (code: any) => {
    setProducts(Products.filter((item: any) => item.code !== code));
  };
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };
  const totalIncome = () => {
    // console.log("ggg", order);
    let total = 0;

    for (var i = 0; i < Products.length; i++) {
      const test = Products[i].orderQuantity
        ? +Products[i].price * +Products[i].orderQuantity
        : 0;
      total += test;
    }

    return total;
  };

  async function getItemsSearch() {
    // console.log(event);
    await axios
      .get("https://shop-server-iota.vercel.app/Searchproducts", {
        params: { event, token, email },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Custom-Header": "foobar",
        },
      })
      .then((resp: any) => {
        const tempArr = [...Products];
        resp.data.data.length > 0 &&
        Products.every((e: any) => e._id !== resp.data.data[0]._id)
          ? tempArr.push(resp.data.data[0])
          : enqueueSnackbar("Error item is not found or it is used", {
              variant: "error",
            });
        setProducts(tempArr || []);
        setLoading(false);
        setEvent("");
        setValidation(true);
      })
      .catch(function (error: any) {
        enqueueSnackbar("Error contacting server", {
          variant: "error",
        });
        setValidation(false);
      });
  }

  async function getOrders() {
    setLoading(true);
    await axios
      .get("https://shop-server-iota.vercel.app/orders", {
        params: { token, email },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Custom-Header": "foobar",
        },
      })
      .then((resp: any) => {
        setOrders(resp.data.data || []);
        setLoading(false);
        setValidation(true);
      })
      .catch(function (error: any) {
        setValidation(false);
      });
  }
  async function getProducts() {
    setLoading(true);
    await axios
      .get("https://shop-server-iota.vercel.app/products", {
        params: { token, email },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Custom-Header": "foobar",
        },
      })
      .then((resp: any) => {
        setProducts(resp.data.data.filter((item: any) => item.quantity < 10));
        setLoading(false);
        setValidation(true);
      })
      .catch(function (error: any) {
        setValidation(false);
      });
  }
  useEffect(() => {
    if (Validation == false) {
      router.push("/");
    }
  }, [Validation]);

  useEffect(() => {
    getProducts();

    // getDataformfirebase();
  }, []);

  useEffect(() => {
    if (value == 1) {
      getOrders();
    }
    // getDataformfirebase();
  }, [value]);

  const handleAdd = () => {
    const d: any = new Date();
    const date = moment(d).format("dddd, MMMM Do, YYYY h:mm:ss A");
    axios
      .post("https://shop-server-iota.vercel.app/newOrder", {
        id,
        Products,
        email,
        date,
      })
      .then(function (response: any) {
        getProducts();
      })
      .catch(function (error: any) {
        console.log(error);
      });
  };
  return (
    <>
      <Grid container spacing={1} sx={{ p: 1 }}>
        <Grid item xs={12}>
          <Typography variant="h4">Orders</Typography>
        </Grid>
        <Grid item xs={7} sx={{ mb: 3 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="full width tabs example"
            TabIndicatorProps={{
              style: { background: "black", color: "black" },
            }}
          >
            <Tab
              label="New Order"
              {...a11yProps(0)}
              sx={{ fontWeight: 600, width: "200px" }}
            />
            <Tab
              label="InProgress Order "
              {...a11yProps(1)}
              sx={{ fontWeight: 600 }}
            />
          </Tabs>
        </Grid>
        {/* <Grid item xs={12} sm={5} lg={7}>
          <Button
            variant="contained"
            onClick={() => {
              //   setOpenNew(true);
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
        </Grid> */}
        {value == 0 && (
          <Grid item xs={12} sm={7} lg={5} sx={{ p: 1 }}>
            <TextField
              id="outlined-basic"
              label="Add new item using code "
              variant="outlined"
              size="small"
              fullWidth
              value={event}
              onKeyDown={(ev: any) => {
                if (ev.key === "Enter") {
                  getItemsSearch();
                  ev.preventDefault();
                }
              }}
              onChange={(event: any) => {
                setEvent(event.target.value);
              }}
            />
          </Grid>
        )}{" "}
        <Grid item xs={12}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Card sx={{ height: "100%", boxShadow: 0 }}>
              {loading ? (
                <>Loading</>
              ) : (
                <TableContainer
                  sx={{
                    maxHeight: "100%",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#59a96a" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 500,
                            color: "white",

                            fontSize: "16px",
                            textTransform: "capitalize",
                          }}
                        >
                          code
                        </TableCell>
                        <TableCell
                          align="left"
                          sx={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "white",

                            textTransform: "capitalize",
                          }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "white",

                            textTransform: "capitalize",
                          }}
                        >
                          Quantity
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "white",

                            textTransform: "capitalize",
                          }}
                        >
                          Price
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "white",

                            textTransform: "capitalize",
                          }}
                        >
                          Supplier
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 500,
                            color: "white",
                            fontSize: "16px",
                            textTransform: "capitalize",
                          }}
                        >
                          Currency
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: 500,
                            color: "white",
                            fontSize: "16px",
                            textTransform: "capitalize",
                          }}
                        >
                          Order Quantity
                        </TableCell>
                        <TableCell align="center" />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Products.filter(
                        (item: any, index: any) => index < rowsPerPage
                      )?.map((row: any, index: any) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ color: "#59a96a", fontWeight: 600 }}
                          >
                            {row.code}
                          </TableCell>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                width: "200px",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Slider
                                max={1000}
                                min={0}
                                defaultValue={+row.quantity}
                                disabled
                                sx={{
                                  width: "87%",
                                  "& .MuiSlider-thumb": { display: "none" },
                                  "& .MuiSlider-track": {
                                    backgroundColor:
                                      +row.quantity <= 0
                                        ? "red"
                                        : +row.quantity < 10
                                        ? "orange"
                                        : "#59a96a",
                                    height: 7,
                                    border: "none",
                                  },
                                  "& .MuiSlider-rail": {
                                    backgroundColor:
                                      +row.quantity <= 0
                                        ? "red"
                                        : +row.quantity < 20
                                        ? "orange"
                                        : "#59a96a",
                                  },
                                }}
                              />
                              <Typography
                                sx={{
                                  width: "10%",
                                  color:
                                    +row.quantity <= 0
                                      ? "red"
                                      : +row.quantity < 20
                                      ? "orange"
                                      : "#59a96a",
                                  fontWeight: 600,
                                }}
                              >
                                {row.quantity}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell align="right">{row.price}</TableCell>
                          <TableCell align="center">{row.supplier}</TableCell>
                          <TableCell align="center">{row.currency}</TableCell>
                          <TableCell align="center">
                            <TextField
                              label="Order Quantity"
                              size="small"
                              type={"number"}
                              onBlur={(e: any) => {
                                const temp = [...Products];
                                temp[index].orderQuantity = +e.target.value;
                                temp[index].code = row.code;
                                temp[index].name = row.name;
                                temp[index].price = row.price;
                                setProducts(temp);
                              }}
                            />
                          </TableCell>

                          <TableCell align="right">
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  DeleteItem(row.code);
                                }}
                                color="error"
                              >
                                Delete
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell rowSpan={4} />
                        <TableCell
                          colSpan={4}
                          sx={{ fontWeight: 600, fontSize: "15px" }}
                        >
                          Subtotal
                        </TableCell>
                        <TableCell
                          align="right"
                          colSpan={2}
                          sx={{ fontWeight: 600, fontSize: "15px" }}
                        >
                          {totalIncome()}
                          {/* {ccyFormat(invoiceSubtotal)} */}
                        </TableCell>
                        <TableCell align="left">
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              onClick={handleAdd}
                              sx={{
                                backgroundColor: "#59a96a",
                                ":hover": {
                                  backgroundColor: alpha("#59a96a", 0.7),
                                },
                              }}
                            >
                              upload order{" "}
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25, 100]}
                component="div"
                count={Products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </TabPanel>
        </Grid>{" "}
        <Grid item xs={12}>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Card sx={{ height: "100%", boxShadow: 0 }}>
              {loading ? (
                <>Loading</>
              ) : (
                <TableContainer
                  sx={{
                    maxHeight: "100%",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <Table>
                    <TableHead sx={{ backgroundColor: "#59a96a" }}>
                      <TableRow>
                        <TableCell />

                        <TableCell
                          sx={{
                            fontWeight: 500,
                            color: "white",

                            fontSize: "16px",
                            textTransform: "capitalize",
                          }}
                        >
                          Order Id
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 500,
                            color: "white",

                            fontSize: "16px",
                            textTransform: "capitalize",
                          }}
                        >
                          Date{" "}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Orders?.map((row: any, index: any) => (
                        <Row key={row._id} row={row} getorders={getOrders} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25, 100]}
                component="div"
                count={Products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </TabPanel>{" "}
        </Grid>
      </Grid>
    </>
  );
}
function Row(props: { row: any; getorders: any }) {
  const { row, getorders } = props;
  const [open, setOpen] = React.useState(false);
  const email =
    typeof window !== "undefined"
      ? // @ts-ignore

        JSON.parse(localStorage.getItem("Email"))
      : "";

  const axios = require("axios");
  const isOrder = true;
  async function UpdateItem(id: any, Data: any) {
    const list2 = Data?.map((item: any) => {
      return {
        code: item.code,

        quantity: +item.orderQuantity,
      };
    });
    list2.length > 0 &&
      (
        await axios
          .post("https://shop-server-iota.vercel.app/updateProducts", {
            list2,
            email,
            isOrder,
            id,
          })
          .then((resp: any) => {
            getorders();

            enqueueSnackbar("Order had inserted", {
              variant: "success",
            });
          })
      ).catch(function (error: any) {
        enqueueSnackbar("Error contacting server", {
          variant: "error",
        });
      });
  }
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
          {row._id}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.date}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                order
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>code</TableCell>
                    <TableCell>name</TableCell>
                    <TableCell align="right">supplier</TableCell>

                    <TableCell align="right">Order Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.order?.map((historyRow: any) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.code}
                      </TableCell>
                      <TableCell>{historyRow.name}</TableCell>
                      <TableCell align="right">{historyRow.supplier}</TableCell>
                      <TableCell align="right">
                        {historyRow.orderQuantity}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        onClick={() => {
                          UpdateItem(row._id, row.order);
                        }}
                        sx={{
                          backgroundColor: "#59a96a",
                          ":hover": {
                            backgroundColor: alpha("#59a96a", 0.7),
                          },
                        }}
                      >
                        Mark as Done{" "}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
