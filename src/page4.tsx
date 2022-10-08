import { createContext, useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
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
      classes={"Card-Widget"}
      sx={{ bgcolor: "black", border: "2px solid white", marginTop: "20%" }}
    >
      <p>Card Widget</p>
      <Box
        classes={"card-list-view"}
        sx={{
          bgcolor: "purple",
          border: "2px solid yellow",
          width: "80%",
          margin: "auto",
        }}
      >
        <p>Insert List of Card View here(Widget)</p>
        <Box
          classes={"Widget-Box"}
          sx={{
            bgcolor: "navy",
            border: "2px solid red",
            width: "60%",
            margin: "auto",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          <List sx={{ textAlign: "left" }}>
            <ListItemButton>
              <ListItemText primary="Etherium"></ListItemText>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="DogeCoin"></ListItemText>
            </ListItemButton>
          </List>
        </Box>
      </Box>
      <Box classes={"buttons"} sx={{ padding: "5px" }}>
        <Button sx={{ padding: "30px" }}>Delete</Button>
        <Button sx={{ padding: "30px" }}>Modify</Button>
        <Button sx={{ padding: "30px" }}>Create New</Button>
      </Box>
    </Box>
  );
}

export default App;
