import { createContext, useContext, useState } from "react";
import reactLogo from "./assets/react.svg";

import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { ethers } from "ethers";
import * as React from "react";
import { padding } from "@mui/system";
import { alignProperty } from "@mui/material/styles/cssUtils";

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
const provider = new ethers.providers.Web3Provider(window.ethereum);

// MetaMask requires requesting permission to connect users accounts
async function connectWallet() {
  await provider.send("eth_requestAccounts", []);
}
// The MetaMask plugin also allows signing transactions to
// send ether and pay to change state within the blockchain.
// For this, you need the account signer...
const signer = provider.getSigner();

function App() {
  const [coin, setCoin] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoin(event.target.value as string);
  };

  return (
    <Card
      classes={"Donation"}
      sx={{
        marginTop: "20%",
        width: "20%",
        marginLeft: "42%",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "30px",
        }}
      >
        <Typography variant="h6" sx={{ marginTop: "20px" }}>
          Donation Wallet
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "20px",
          display: "inline-flex",
          flexDirection: "row",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <FormControl sx={{ m: "1px", width: "300px" }}>
          <TextField
            id="Filled-basic"
            label="Enter Amount"
            variant="filled"
            type="number"
            inputProps={{ min: "0" }}
          ></TextField>
        </FormControl>
        <FormControl sx={{ m: "1px", width: "150px" }}>
          <TextField
            label="Select Currency"
            select
            value={coin}
            onChange={handleChange}
          >
            <MenuItem value={1}>Etheriunm</MenuItem>
            <MenuItem value={2}>DogeCoin</MenuItem>
            <MenuItem value={3}>Bitcoin</MenuItem>
          </TextField>
        </FormControl>
      </Box>
      <Box
        classes={"buttons"}
        sx={{
          marginTop: "10px",
          marginBottom: "10px",
          padding: "5%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          alignItems: "flex-end",
          width: "100%",
        }}
      >
        <Button>Connect</Button>
        <Button>Donate</Button>
      </Box>
    </Card>
  );
}

export default App;
