import { createContext, useContext, useState } from "react";
import reactLogo from "./assets/react.svg";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  Container,
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
    <Card
      classes={"Card-Widget"}
      sx={{
        marginTop: "20%",
        alignItems: "center",
        textAlign: "center",
        width: "50%",
        marginLeft: "25%",
      }}
    >
      <p>Card Widget</p>
      <Container
        className="card-list-view"
        sx={{
          width: "80%",
          margin: "auto",
        }}
      >
        <List sx={{ textAlign: "left", maxHeight: "60%", overflow: "auto" }}>
          <CardActionArea>
            <ListItemButton>
              <Card sx={{ width: "100%", marginTop: "2px" }}>
                <ListItemText
                  primary="Etherium"
                  sx={{ marginLeft: "20px" }}
                ></ListItemText>
              </Card>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="DogeCoin"></ListItemText>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Bitcoin"></ListItemText>
            </ListItemButton>
          </CardActionArea>
        </List>
      </Container>
      <Box classes={"buttons"} sx={{ padding: "5px" }}>
        <Button sx={{ padding: "30px" }}>Delete</Button>
        <Button sx={{ padding: "30px" }}>Modify</Button>
        <Button sx={{ padding: "30px" }}>Create New</Button>
      </Box>
    </Card>
  );
}

export default App;
