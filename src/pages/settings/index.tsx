import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { storage } from "@/firebase-backup/index";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AuthContext from "@/hooks/authContext";
import { enqueueSnackbar } from "notistack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ref as databaseRef } from "firebase/database";
import { ref as storageRef, getStorage } from "firebase/storage";
import moment from "moment";

import { getDatabase, onValue } from "firebase/database";
import firebaseconf from "@/firebase";

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
export default function Setting() {
  const [name, setName] = useState<any>("");
  const [passUser, setPassUser] = useState<any>("");
  const [settingsType, setSettingsType] = useState<any>("");
  const [loading, setLoading] = useState<any>(false);
  const [number, setNumber] = useState<any>("");
  const [rows, setRows] = useState<any>([]);
  const [imgsSrc, setImgsSrc] = useState<any>("");
  const [image, setImage] = useState<File | null>(null);
  const [progress, setProgress] = useState<any>(0);
  const [FReports, setFirebaseReports] = useState<any>([]);

  const axios = require("axios");
  const { email, token, type, pass, user } = useContext(AuthContext);
  useEffect(() => {
    handleUpload();
    getReportsformfirebase();
  }, [image]);
  const handleImageChange = (e: any) => {
    if (e?.target?.files && e?.target?.files?.length > 0) {
      const selectedFile = e?.target?.files[0];
      setImage(selectedFile);
    }
  };
  async function getReportsformfirebase() {
    const db = getDatabase(firebaseconf);
    const starCountRef = databaseRef(db);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setFirebaseReports(data);
    });
  }

  const returnTotal = (user: any, day: any) => {
    let total = 0;
    let total2 = 0;

    const data = FReports
      ? Object?.keys(FReports)
          // ?.filter((item: any) => item.user == "test")
          ?.map((item: any) => {
            return FReports[item];
          })
          ?.filter((item: any) => item.user == user)
          ?.map((item: any) => (total = total + item.total))
      : [];
    const today = moment().startOf("day");
    const data2 = FReports
      ? Object?.keys(FReports)
          ?.map((item: any) => FReports[item])
          ?.filter((item: any) => {
            const parsedDate = moment(
              item?.date,
              "dddd, MMMM Do, YYYY h:mm:ss A"
            ).startOf("day"); // Extract the date part and set the time to the start of the day
            return moment(parsedDate).isSame(today, "day");
          })
          ?.filter((item: any) => item.user == user)
          ?.map((item: any) => (total2 = total2 + item.total))
      : [];
    console.log("dataa", data2);

    return day ? total2 : total;
  };
  const handleUpload = () => {
    if (image) {
      const storageRef1 = storageRef(storage, `images/${image.name}`);

      // const imageRef = storageRef.child(`files/${image.name}`);

      const uploadTask = uploadBytesResumable(storageRef1, image);

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
      setImage(null);
    } else {
      console.error("No image selected for upload.");
    }
  };
  async function getUsers() {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://shop-server-iota.vercel.app/users",
        {
          params: { token, email },
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Custom-Header": "foobar",
          },
        }
      );
      setRows(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (settingsType == "Users") {
      getUsers();
    }
    // getDataformfirebase();
  }, [settingsType]);
  const handleAdd = () => {
    const id = uuidv4();
    setLoading(true);
    axios
      .post("https://shop-server-iota.vercel.app/newUser", {
        id,
        passUser,
        name,
        number,
        email,
      })
      .then(function (response: any) {
        setLoading(false);
        if (response.data == "found") {
          enqueueSnackbar("This user is already found", {
            variant: "error",
          });
        } else {
          enqueueSnackbar("User had inserted successfully", {
            variant: "success",
          });
        }
      })
      .catch(function (error: any) {
        setLoading(false);

        console.log(error);
      });
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid item xs={5}>
        {" "}
        <Card
          sx={{ p: 1, cursor: "pointer" }}
          onClick={() => {
            setSettingsType("AdminSettings");
          }}
        >
          Admin Settings
        </Card>
        <Card
          sx={{ p: 1, mt: 2, cursor: "pointer" }}
          onClick={() => {
            setSettingsType("AddUser");
          }}
        >
          Add User
        </Card>
        <Card
          sx={{ p: 1, mt: 2, cursor: "pointer" }}
          onClick={() => {
            setSettingsType("Users");
          }}
        >
          Users
        </Card>
      </Grid>
      <Grid item xs={7}>
        {settingsType == "AddUser" ? (
          <Card sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
            <Typography> Add User</Typography>
            <TextField
              label=" Name"
              variant="outlined"
              fullWidth
              size="small"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              size="small"
              value={passUser}
              onChange={(e) => {
                setPassUser(e.target.value);
              }}
            />
            <TextField
              label="Phone number "
              variant="outlined"
              fullWidth
              size="small"
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
            <Stack direction="row">
              <Button
                variant="contained"
                onClick={handleAdd}
                disabled={loading}
              >
                Add User
              </Button>
            </Stack>
          </Card>
        ) : settingsType == "Users" ? (
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 0.1,
              boxShadow: "0px 0px 0px 0px !important",
            }}
          >
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead sx={{ backgroundColor: "divider" }}>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Number</TableCell>{" "}
                    <TableCell>selling(Today)</TableCell>
                    <TableCell>selling</TableCell>
                    <TableCell>Password</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.number}</TableCell>
                      <TableCell>{returnTotal(row.name, true)}</TableCell>
                      <TableCell>{returnTotal(row.name, false)}</TableCell>
                      <TableCell>{row.pass}</TableCell>
                      <TableCell>
                        <Button variant="contained">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ) : (
          <Card sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
            <Stack direction="row" spacing={2}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  width: "170px",
                  height: "170px",
                  borderRadius: "50%",
                  backgroundImage: `url(${
                    progress == 100
                      ? imgsSrc
                      : progress > 0
                      ? `https://th.bing.com/th/id/OIP.Z-T3CJd0LsDvCBSoWraSBwHaHa?w=183&h=184&c=7&r=0&o=5&pid=1.7`
                      : ""
                  })`,
                  backgroundSize: "170px 170px",
                  backgroundRepeat: "no-repeat",
                }}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  onChange={(event: any) => {
                    handleImageChange(event);
                  }}
                />
              </Button>{" "}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  width: "60%",
                  pt: 4,
                }}
              >
                <TextField
                  label=" Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={email}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={pass}
                />
                <Button
                  variant="contained"
                  sx={{ width: "100px" }}
                  onClick={handleAdd}
                  disabled={loading}
                >
                  Save{" "}
                </Button>
              </Box>
            </Stack>
          </Card>
        )}
      </Grid>
    </Grid>
  );
}
