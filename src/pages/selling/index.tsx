import {
  alpha,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Modal,
  Stack,
  TextField,
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
import { v4 as uuidv4 } from "uuid";
import { getDatabase, onValue, ref, set } from "firebase/database";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import moment from "moment";
import { useRouter } from "next/navigation";
import firebaseconf from "@/firebase";
import Items from "@/components/items";
import NewProductSell from "@/components/new-product-sell";

const TAX_RATE = 2;
const style2 = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, sm: 700, md: 900 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: 350, md: 500 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 2,
};
function ccyFormat(num: number) {
  return `${num.toFixed(2)}`;
}

function priceRow(qty: number, unit: number) {
  return qty * unit;
}

function createRow(desc: string, qty: number, unit: number) {
  const price = priceRow(qty, unit);
  return { desc, qty, unit, price };
}

interface Row {
  desc: string;
  qty: number;
  unit: number;
  price: number;
}

function subtotal(items: readonly Row[]) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}

const rows = [
  createRow("Paperclips (Box)", 100, 1.15),
  createRow("Paper (Case)", 10, 45.99),
  createRow("Waste Basket", 2, 17.99),
];

const invoiceSubtotal = subtotal(rows);
const invoiceTaxes = TAX_RATE * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;
export default function Selling() {
  const axios = require("axios");
  const [FireList, setFireList] = useState([]);

  const [Products, setProducts] = useState<any>([]);
  const [type, setType] = useState("TypeA");
  const [category, setCategory] = useState(null);
  const [CustomerName, setCustomerName] = useState(null);
  const [Deposit, setDeposit] = useState(100);
  const [Products2, setProducts2] = useState<any>([]);
  const [ModalData, setModalData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);
  const [test, settest] = useState<boolean>(true);
  const [GetData, setGetData] = useState<boolean>(false);
  const [OpenSell, setOpenSell] = useState<boolean>(false);
  const [Validation, setValidation] = useState<boolean>(true);
  const router = useRouter();
  const email =
    typeof window !== "undefined"
      ? // @ts-ignore

        JSON.parse(localStorage.getItem("Email"))
      : "";
  const token =
    typeof window !== "undefined"
      ? // @ts-ignore

        JSON.parse(localStorage.getItem("token"))
      : "";

  
  const totalIncome = () => {
    // console.log("ggg", Products2);
    let total = 0;
    for (var i = 0; i < Products2.length; i++) {
      const test =
        type == "TypeA"
          ? +Products2[i].sellpricea * +Products2[i].unit
          : +Products2[i].sellpriceb * +Products2[i].unit;
      total += test;
    }

    return total;
  };
  const Push = (paymentType: any) => {
    setLoading(true);
    if (typeof window !== "undefined") {
      const db = getDatabase(firebaseconf);
      const id = uuidv4();
      const DepositAmountt =
        paymentType == "Cash"
          ? 0
          : totalIncome() - (totalIncome() * Deposit) / 100;

      const total = totalIncome();
      const d: any = new Date();
      const date = moment(d).format("dddd, MMMM Do, YYYY h:mm:ss A");
      if (DepositAmountt > 0) {
        updateCustomerBalance(CustomerName, DepositAmountt);
      }
      addReport(id, date, db, DepositAmountt, total, email);
    } else {
      console.log("error");
    }
  };
  const list = Products2.map((item: any) => {
    return {
      code: item.code,
      name: item.name,
      unit: +item.unit,
      currency: item.currency,
      quantity: +item.quantity - +item.unit,
      sellpricea: type == "TypeA" ? item.sellpricea : 0,
      sellpriceb: type == "TypeB" ? item.sellpriceb : 0,
    };
  });
  const list2 = Products2.map((item: any) => {
    return {
      code: item.code,

      quantity: +item.unit,
    };
  });

  async function UpdateItem() {
    // console.log("list", list2);
    await axios
      .post("https://shop-server-iota.vercel.app/updateSellingProducts", {
        list2,
        email,
      })
      .then((resp: any) => {
        setProducts2([]);
      });
  }
  async function updateCustomerBalance(name: any, balance: any) {
    // console.log("list", list2);
    await axios
      .post("https://shop-server-iota.vercel.app/updateCustomerBalance", {
        name,
        balance,
        email,
      })
      .then((resp: any) => {
        setProducts2([]);
      });
  }
  async function addReport(
    id: any,
    date: any,
    db: any,
    deposit: any,
    total: any,
    email: any
  ) {
    set(
      ref(
        db,

        id
      ),
      {
        list,
        date,
        CustomerName,
        deposit,
        total,
        id,
        email,
      }
    );
    UpdateItem();
    setLoading(false);

    setProducts2([]);
    setOpenSell(false);
  }
  const handleDelete = (code: any, index: any) => {
    const newProducts = [...Products2];

    newProducts.splice(index, 1);
    setProducts2(newProducts);
  };
  async function getItemsSearch(event: any) {
    // console.log(event);
    const resp = await axios.get(
      "https://shop-server-iota.vercel.app/Searchproducts",
      {
        params: { event, token, email },
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Custom-Header": "foobar",
        },
      }
    );
    setModalData(resp.data.data);
    setOpenSearchModal(true);
  }

  // async function getDataformfirebase() {
  //   const db = getDatabase(firebaseConf);
  //   const starCountRef = ref(db);
  //   onValue(starCountRef, (snapshot: any) => {
  //     const data = snapshot.val();
  //     setFireList(data);
  //     const data2 = data
  //       ? Object?.keys(data)?.map((item: any) => {
  //           return data[item];
  //         })
  //       : [];
  //     setProducts(data2[0]?.list);
  //     setLoading(false);
  //   });
  // }

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
        setProducts(resp.data.data);
        setLoading(false);
        setValidation(true);
      })
      .catch(function (error: any) {
        setGetData(!GetData);
        setValidation(false);
      });
  }
  useEffect(() => {
    getProducts();
  }, []);

  const excludedProducts = Products
    ? Products?.filter(
        (person1: any) =>
          !Products2.some((person2: any) => person1.code === person2.code)
      )
    : [];

  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };
  const joinedArray: any = [];
  const seenCategories: any = {};

  Products.forEach((obj: any) => {
    if (!seenCategories[obj.category]) {
      seenCategories[obj.category] = true;
      joinedArray.push({ category: obj.category, items: [] });
    }
    joinedArray
      .find((item: any) => item.category === obj.category)
      .items.push(obj);
  });
  // console.log('exclud',excludedProducts);
  return (
    <>
      <Modal
        open={openSearchModal}
        onClose={() => {
          setOpenSearchModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <Items
            Products={ModalData}
            sell={true}
            setProducts2={setProducts2}
            setOpenSearchModal={setOpenSearchModal}
          />
        </Box>
      </Modal>
      <Modal
        open={OpenSell}
        onClose={() => {
          setOpenSell(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewProductSell
            list={list}
            total={totalIncome()}
            setDeposit={setDeposit}
            Deposit={Deposit}
            push={Push}
            setCustomerName={setCustomerName}
            CustomerName={CustomerName}
            handleClose={() => {
              setOpenSell(false);
            }}
          />
        </Box>
      </Modal>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12} lg={4}>
          <Grid container spacing={1} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              Categories:
            </Grid>{" "}
            {joinedArray.map((item: any, index: any) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card
                  onClick={() => {
                    setCategory(item.category);
                  }}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    backgroundColor: "#23432A",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                >
                  {item.category}
                </Card>
              </Grid>
            ))}
            <Grid item xs={12} />
            {category !== null &&
              excludedProducts
                .filter((item: any) => item.category == category)
                .map((row: any, index: any) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Card
                      sx={{
                        p: 1,
                        width: "80%",
                        backgroundColor:
                          row.quantity == 0 ? "divider" : "#59a96a",
                        cursor: row.quantity == 0 ? "not-allowed" : "pointer",
                      }}
                      onClick={() => {
                        row.quantity > 0
                          ? setProducts2((oldArray: any) => [
                              ...oldArray,
                              { ...row },
                            ])
                          : null;
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "white", textTransform: "capitalize" }}
                      >
                        {" "}
                        {row.category}
                      </Typography>
                      <Typography sx={{ color: "white" }}>
                        {" "}
                        {row.name}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
          </Grid>
        </Grid>
        {/* <Divider
          orientation="vertical"
          sx={{ height: "90vh", mt: 1, borderWidth: 3 }}
        /> */}

        <Grid item xs={12} md={12} lg={8}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography sx={{ fontWeight: 600 }}>Price type: </Typography>
              <FormControl sx={{ width: "130px" }}>
                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Type"
                  size="small"
                  onChange={handleChange}
                >
                  <MenuItem value={"TypeA"}>sell price A</MenuItem>
                  <MenuItem value={"TypeB"}>sell price B</MenuItem>
                </Select>
              </FormControl>{" "}
            </Box>
            <TextField
              id="outlined-basic"
              label="Search using code "
              variant="outlined"
              size="small"
              sx={{ mt: 1, mb: 1, width: "50%" }}
              onKeyDown={(event: any) => {
                if (event.keyCode === 13) {
                  getItemsSearch(event.target.value);
                }
              }}
            />
          </Box>
          {loading ? (
            <>loading</>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="spanning table">
                <TableHead sx={{ backgroundColor: "#59a96a" }}>
                  <TableRow>
                    <TableCell>code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="left">Qty.</TableCell>
                    <TableCell align="right">Price/unit</TableCell>
                    <TableCell align="right">Sum</TableCell>
                    <TableCell align="right" />
                  </TableRow>
                </TableHead>
                {Products2.length > 0 ? (
                  <TableBody>
                    {Products2.map((row: any, index: any) => {
                      // console.log("roo0", row);
                      return (
                        <TableRow key={index}>
                          <TableCell>{row?.code}</TableCell>
                          <TableCell>{row?.name}</TableCell>
                          <TableCell align="left">
                            <TextField
                              variant="outlined"
                              defaultValue={row?.unit}
                              onBlur={(event: any) => {
                                let updatedList = [
                                  (Products2[index].unit = event.target.value),
                                ];
                                const newState = Products2.map((obj: any) => {
                                  if (obj[index] === index) {
                                    return { ...obj, updatedList };
                                  }

                                  return obj;
                                });

                                setProducts2(newState);
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            {type == "TypeA" ? row.sellpricea : row.sellpriceb}
                          </TableCell>
                          <TableCell align="right">
                            {type == "TypeA"
                              ? row.sellpricea * +row?.unit
                              : row.sellpriceb * +row?.unit}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              onClick={() => {
                                handleDelete(row?.code, index);
                              }}
                              color="error"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {Products2?.length > 0 && (
                      <>
                        <TableRow>
                          <TableCell rowSpan={3} />
                          <TableCell
                            colSpan={2}
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
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={2}
                              justifyContent="flex-end"
                            >
                              <Button
                                onClick={() => {
                                  setProducts2([]);
                                }}
                                sx={{ color: "#59a96a", fontWeight: 600 }}
                              >
                                Reset
                              </Button>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  setOpenSell(true);
                                }}
                                sx={{
                                  backgroundColor: "#59a96a",
                                  ":hover": {
                                    backgroundColor: alpha("#59a96a", 0.7),
                                  },
                                }}
                              >
                                Buy
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        {/* <TableRow>
                      <TableCell>Tax</TableCell>
                      <TableCell align="right">{`${(TAX_RATE * 100).toFixed(
                        0
                      )} %`}</TableCell>
                      <TableCell align="right">
                        {ccyFormat(invoiceTaxes)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell align="right">
                        {ccyFormat(invoiceTotal)}
                      </TableCell>
                    </TableRow> */}
                      </>
                    )}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={12}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Typography>No Items</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
}
