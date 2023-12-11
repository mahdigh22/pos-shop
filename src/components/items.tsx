import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  LinearProgress,
  LinearProgressProps,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import React, { useContext } from "react";
import AuthContext from "@/hooks/authContext";
import DeleteIcon from "@mui/icons-material/Delete";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {props.value}
        </Typography>
      </Box>
    </Box>
  );
}
export default function Items(props: any) {
  const {
    Products,
    DeleteItem,
    loading,
    setEdit,
    setData,
    sell,
    setProducts2,
    setOpenSearchModal,
  } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const axios = require("axios");
  const { email, token, type } = useContext(AuthContext);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };
  console.log("prodd", Products);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
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

                      {!sell && (
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
                      )}
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "white",

                          textTransform: "capitalize",
                        }}
                      >
                        Sellpricea
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
                        Sellpriceb
                      </TableCell>
                      {!sell && (
                        <TableCell
                          align="right"
                          sx={{
                            fontWeight: 500,
                            fontSize: "16px",
                            color: "white",

                            textTransform: "capitalize",
                          }}
                        >
                          Cost
                        </TableCell>
                      )}
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 500,
                          fontSize: "16px",
                          color: "white",

                          textTransform: "capitalize",
                        }}
                      >
                        Category
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
                        Unit
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
                      {!sell && (
                        <>
                          {" "}
                          <TableCell align="center" />
                          <TableCell align="center" />
                        </>
                      )}
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
                          cursor: sell ? "pointer" : null,
                        }}
                        onClick={() => {
                          {
                            if (sell) {
                              setProducts2((oldArray: any) => [
                                ...oldArray,
                                { ...row },
                              ]);
                              setOpenSearchModal(false);
                            }
                          }
                        }}
                      >
                        <TableCell>
                          <Avatar
                            alt="Remy Sharp"
                            src={row.imgsSrc?.split(",")[0]}
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#59a96a", fontWeight: 600 }}>
                          {row.code}
                        </TableCell>
                        <TableCell align="left">{row.name}</TableCell>

                        {!sell && (
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
                        )}
                        <TableCell align="center">{row.sellpricea}</TableCell>
                        <TableCell align="center">{row.sellpriceb}</TableCell>
                        {!sell && (
                          <TableCell align="right">
                            {type == "user" ? "-" : row.price}
                          </TableCell>
                        )}
                        <TableCell align="right">{row.category}</TableCell>
                        <TableCell align="right">{row.unit}</TableCell>
                        <TableCell align="center">{row.supplier}</TableCell>
                        <TableCell align="center">{row.currency}</TableCell>
                        {!sell && (
                          <TableCell align="right">
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant="contained"
                                onClick={() => {
                                  setEdit(true);
                                  setData(row);

                                  // DeleteItem(row.code);
                                }}
                                disabled={type == "user"}
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
                          </TableCell>
                        )}
                        {!sell && (
                          <TableCell align="right">
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                aria-label="delete"
                                size="large"
                                onClick={() => {
                                  DeleteItem(row.code);
                                }}
                                color="error"
                                disabled={type == "user"}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                              {/* <Button
                                variant="contained"
                                onClick={() => {
                                  DeleteItem(row.code);
                                }}
                                color="error"
                                disabled={type == "user"}
                              >
                                Delete
                              </Button> */}
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            {!sell && (
              <TablePagination
                rowsPerPageOptions={[1, 5, 10, 25, 100]}
                component="div"
                count={Products.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
