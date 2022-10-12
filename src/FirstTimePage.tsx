import { createContext, useContext, useState, useEffect } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { ethers } from "ethers";

import { useNavigate } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";
import DirectDonationManagerFactoryInterface from "./logic/DirectDonationManagerFactory";
import DirectDonationManagerInterface from "./logic/DirectDonationManager";

function usePageState() {
  //use to update page to render when completing setup
  const ECSInstance = EventControllerSingleton.getInstance();
  const [trigger, setTrigger] = useState<null>(null);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);
  const nav = useNavigate();

  function onFirstBootRun() {
    try {
      console.log(`start up First Time Page`);
      redirectForExcessData();
      redirectForMissingData();
    } catch (e) {
      console.log(e);
    }
  }

  function isLocalDDMFactorySetUp() {
    return ECSInstance.DDMFactoryInstance === null ? false : true;
  }

  function isWalletSetUp() {
    return ECSInstance.provider === null || ECSInstance.caller === null
      ? false
      : true;
  }

  function isLocalDDManagerSetUp() {
    return ECSInstance.DDManagerInstance === null ? false : true;
  }

  function redirectForMissingData() {
    if (!isWalletSetUp() || !isLocalDDMFactorySetUp()) {
      nav("/");
    }
  }

  function redirectForExcessData() {
    if (
      isWalletSetUp() &&
      isLocalDDMFactorySetUp() &&
      isLocalDDManagerSetUp()
    ) {
      nav("/Manager");
    }
  }

  async function createMyDDManagerCallback(data: any) {
    console.log(data);
    await ECSInstance.setDDManager(data._directDonationManagerContract);
    nav(`/Manager`);
  }

  async function createMyDDManager() {
    const contract: DirectDonationManagerFactoryInterface =
      ECSInstance.DDMFactoryInstance as DirectDonationManagerFactoryInterface;
    await contract.createMyDirectDonationManager(createMyDDManagerCallback);
  }

  async function onCreateMyManagerClick() {
    try {
      await createMyDDManager();
      setTrigger(null);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (firstBoot) {
      onFirstBootRun();
      setFirstBoot(false);
    }
  });

  return { onCreateMyManagerClick };
}

function FirstTimePage() {
  const { onCreateMyManagerClick } = usePageState();

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      minHeight={"100vh"}
    >
      <Card sx={{ padding: "1em" }}>
        <Typography mb={"1em"}>
          It is your first-time. click the button below to to create your
          Donation Manager.
        </Typography>
        <Button variant="outlined" onClick={onCreateMyManagerClick}>
          <Typography>Create My Manager</Typography>
        </Button>
      </Card>
    </Box>
  );
}

export default FirstTimePage;
