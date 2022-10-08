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
} from "@mui/material";
import { ethers } from "ethers";
import * as React from "react";
import { padding } from "@mui/system";
import { alignProperty } from "@mui/material/styles/cssUtils";

// A Web3Provider wraps a standard Web3 provider, which is
// what MetaMask injects as window.ethereum into each page
// @ts-ignore window.ethereum type not available
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
        width: "50%",
        marginLeft: "25%",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <p>Donation Wallet</p>
      <Card
        classes={"crypto-wallet-view"}
        sx={{
          width: "80%",
          margin: "auto",
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
      </Card>
      <Box classes={"buttons"} sx={{ padding: "5px" }}>
        <Button sx={{ margin: "auto" }}>Connect</Button>
        <Button sx={{ margin: "auto" }}>Donate</Button>
      </Box>
    </Card>
  );
}

export default App;
