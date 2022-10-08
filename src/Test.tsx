import { createContext, useContext, useState } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { ethers } from "ethers";
import { redirect } from "react-router-dom";
//@ts-ignore

import { useNavigate } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";

function ConnectCard() {
  const nav = useNavigate();

  async function connectWallet() {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    // @ts-ignore window.ethereum type not available
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);
    const ECSInstance = EventControllerSingleton.getInstance();
    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    const signer = provider.getSigner();
    ECSInstance.setProvider(provider);
    ECSInstance.setCaller(signer);

    let settingFactoryResolved: boolean = false;
    await ECSInstance.setDDMFactory().then(() => {
      settingFactoryResolved = true;
    });

    if (settingFactoryResolved) {
      let DDMExist: null | boolean = null;
      await ECSInstance.myDirectDonationManagerExist().then((x) => {
        DDMExist = x;
      });

      if (DDMExist === true) {
        ECSInstance.getMyDirectDonationManager().then((data) => {
          ECSInstance.setDDManager(data.contractAddress as string).then(() => {
            nav("/Manager");
          });
        });
      }

      if (DDMExist === false) {
        nav("/FirstTime");
      }
    }
  }

  return (
    <Card sx={{ padding: "1em" }}>
      <Typography mb={"1em"}>Connect your wallet</Typography>
      <Button variant="outlined" onClick={connectWallet}>
        <Typography>MetaMask</Typography>
      </Button>
    </Card>
  );
}

function TesterCard() {
  let card: any;
  // @ts-ignore

  function logic() {
    if (window.ethereum === null) {
      return <Typography>Please install MetaMask</Typography>;
    }
    return <ConnectCard />;
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
      {logic()}
    </Box>
  );
}

export default TesterCard;
