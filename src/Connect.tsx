import { createContext, useContext, useState } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { ethers } from "ethers";
//@ts-ignore

async function connectWallet() {
  // A Web3Provider wraps a standard Web3 provider, which is
  // what MetaMask injects as window.ethereum into each page
  // @ts-ignore window.ethereum type not available
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();
}

function ConnectWalletCard() {
  return (
    <Card sx={{ padding: "1em" }}>
      <Typography mb={"1em"}>Connect your wallet</Typography>
      <Button variant="outlined" onClick={connectWallet}>
        <Typography>MetaMask</Typography>
      </Button>
    </Card>
  );
}

function Connect() {
  let card: any;
  // @ts-ignore
  if (window.ethereum !== undefined) {
    card = <ConnectWalletCard />;
  } else {
    card = <Typography>Please install MetaMask</Typography>;
  }

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      minHeight={"100vh"}
    >
      {card}
    </Box>
  );
}

export default Connect;
