import { createContext, useContext, useState } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { ethers } from "ethers";

import EventControllerSingleton from "./logic/EventController";

async function createManager() {
  const ECSInstance = EventControllerSingleton.getInstance();
  await ECSInstance.createMyDirectDonationManager();
  const isCreated: boolean = await ECSInstance.myDirectDonationManagerExist();
  if (isCreated) {
    //route to manager app
    console.log("route to manager");
  }
}

function ManagerCreationCard() {
  return (
    <Card sx={{ padding: "1em" }}>
      <Typography mb={"1em"}>
        It is your first-time. click the button below to to create your Donation
        Manager.
      </Typography>
      <Button variant="outlined" onClick={createManager}>
        <Typography>Create My Manager</Typography>
      </Button>
    </Card>
  );
}

function FirstTimerPage() {
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

export default FirstTimerPage;
