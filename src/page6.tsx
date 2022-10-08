import { createContext, useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Box, Button } from "@mui/material";
import { ethers } from "ethers";
import * as React from "react";
import { padding } from "@mui/system";

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
  return (
    <Box
      classes={"Donation"}
      sx={{ bgcolor: "black", border: "2px solid white", marginTop: "20%" }}
    >
      <p>Donation Wallet</p>
      <Box
        classes={"crypto-wallet-view"}
        sx={{
          bgcolor: "silver",
          border: "2px solid yellow",
          width: "80%",
          margin: "auto",
        }}
      >
        <p>Insert CryptoWallet Here(Dropdown list)</p>
      </Box>
      <Box classes={"buttons"} sx={{ padding: "5px" }}>
        <Button sx={{ margin: "auto" }}>Connect</Button>
        <Button sx={{ margin: "auto" }}>Donate</Button>
      </Box>
    </Box>
  );
}

export default App;