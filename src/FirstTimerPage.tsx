import { createContext, useContext, useState } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { ethers } from "ethers";

import { useNavigate } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";

function ManagerCreationCard() {
  const nav = useNavigate();

  async function createManager() {
    const ECSInstance = EventControllerSingleton.getInstance();
    const data = await ECSInstance.createMyDirectDonationManager();
    let isCreated: boolean | null;
    isCreated = await ECSInstance.myDirectDonationManagerExist();
    if (isCreated === true) {
      console.log(data);
      //route to manager app
      await ECSInstance.setDDManager(data.contractAddress).then(() => {
        nav("/Manager");
      });
    }
  }

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
