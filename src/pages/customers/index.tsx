
import { alpha, Box, Button, Card, Grid, Modal, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import NewCustomerForm from "@/components/new-customer-form";
import React, { useContext } from "react";
import AuthContext from "@/hooks/authContext";
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
export default function Customers() {
  const { email, token } = useContext(AuthContext);

  const axios = require("axios");
  const [OpenNew, setOpenNew] = useState<boolean>(false);

  const [Customers, setCustomers] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [Edit, setEdit] = useState<boolean>(false);
  
  const [loading, setLoading] = useState(false);
  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  async function DeleteItem(code: any, balance: any) {
    setLoading(true);
    await axios
      .post("https://shop-server-iota.vercel.app/deleteCustomers", {
        code,
        balance,
        email,
      })
      .then((resp: any) => {
        getCustomers();
        setLoading(false);
      });
  }
  async function getCustomers() {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getCustomers();
    // getDataformfirebase();
  }, []);
  return (
    <>
      <Modal
        open={Edit}
        onClose={() => {
          setEdit(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewCustomerForm
            getCustomers={getCustomers}
            rowData={rowData}
            edit={true}
            handleClose={() => {
              setEdit(false);
            }}
          />{" "}
        </Box>
      </Modal>
      <Modal
        open={OpenNew}
        onClose={() => {
          setOpenNew(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <NewCustomerForm
            getCustomers={getCustomers}
            handleClose={() => {
              setOpenNew(false);
            }}
          />
        </Box>
      </Modal>
      {loading?<>loading</>:
      <Grid container justifyContent="center" spacing={2} sx={{ pt: 1 }}>
        <Grid item xs={12}>
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
            New Customer
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ boxShadow: 0 }}>
            {false ? (
              <>Loading</>
            ) : (
              <TableContainer sx={{ maxHeight: "100%" }}>
                <Table>
                  <TableHead sx={{ backgroundColor: "#59a96a" }}>
                    <TableRow>
                      <TableCell sx={{ color: "white" }}>Name</TableCell>
                      <TableCell sx={{ color: "white" }}>
                        Phone Number
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>Country</TableCell>
                      <TableCell sx={{ color: "white" }}>Balance</TableCell>
                      <TableCell sx={{ color: "white" }}>Status</TableCell>

                      <TableCell />
                      <TableCell />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Customers?.map((row: any, index: any) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          backgroundColor: row.quantity == 0 ? "divider" : null,
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell>{row.number}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{row.balance}</TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: row.status == "Blocked" ? "red" : "#59a96a",
                          }}
                        >
                          {row.status}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              onClick={() => {
                                setRowData(row);
                                setEdit(true);
                              }}
                              sx={{
                                backgroundColor: "#59a96a",
                                ":hover": {
                                  backgroundColor: alpha("#59a96a", 0.7),
                                },
                              }}
                            >
                              Edit
                            </Button>
                          </Stack>
                        </TableCell>{" "}
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              onClick={() => {
                                DeleteItem(row._id, row.balance);
                              }}
                              color="error"
                              disabled={row.balance > 0}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={Customers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Grid>
      </Grid>}
    </>
  );
}
