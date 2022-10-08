import { createContext, useContext, useState } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { ethers } from "ethers";

import EventControllerSingleton from "./logic/EventController";

function ManagerCreationCard() {
  async function createManager() {
    const ECSInstance = EventControllerSingleton.getInstance();
    const data = await ECSInstance.createMyDirectDonationManager();
    let isCreated: boolean | null;
    isCreated = await ECSInstance.myDirectDonationManagerExist();
    if (isCreated === true) {
      //route to manager app
      await ECSInstance.setDDManager(data.contractAddress).then(() => {
        console.log("route to manager");
      });
    }
  }

  return (
    <Card sx={{ padding: "1em" }}>
      <Typography mb={"1em"}>This is the Manager Page!</Typography>
      <Button variant="outlined" onClick={createManager}>
        <Typography>Placeholder</Typography>
      </Button>
    </Card>
  );
}

function ManagerPage() {
  let card: any;
  // @ts-ignore

  function logic() {
    if (window.ethereum === null) {
      return <Typography>Please install MetaMask</Typography>;
    }
    return <ManagerCreationCard />;
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

export default ManagerPage;
