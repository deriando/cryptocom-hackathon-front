import { createContext, useContext, useState, useEffect } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";

import { useNavigate } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";
import DirectDonationManagerFactoryInterface from "./logic/DirectDonationManagerFactory";
import DirectDonationManagerInterface from "./logic/DirectDonationManager";
import { ethers } from "ethers";

function usePageState() {
  //use to update page to render when completing setup
  const ECSInstance = EventControllerSingleton.getInstance();
  const [trigger, setTrigger] = useState<null>(null);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);
  const nav = useNavigate();

  async function onFirstBootRun() {
    try {
      console.log(`start up Front Page`);
      await setupDDMFactory();
      await setupDDManager();
    } catch (e) {
      console.log(e);
    }
  }

  function isLocalDDMFactorySetUp() {
    return ECSInstance.DDMFactoryInstance === null ? false : true;
  }

  async function setupDDMFactory() {
    if (isWalletSetUp()) {
      await ECSInstance.setDDMFactory();
    }
  }

  function isLocalDDManagerSetUp() {
    return ECSInstance.DDManagerInstance === null ? false : true;
  }

  async function isOnChainDDManagerSetUp() {
    const contract: DirectDonationManagerFactoryInterface =
      ECSInstance.DDMFactoryInstance as DirectDonationManagerFactoryInterface;
    return await contract.myDirectDonationManagerExist();
  }

  async function setupDDManager() {
    if (isWalletSetUp() && isLocalDDMFactorySetUp()) {
      const isLocalSetup = isLocalDDManagerSetUp();
      const isOnChainSetup = await isOnChainDDManagerSetUp();

      if (isLocalSetup && isOnChainSetup) {
        nav("Manager");
      }
      if (!isLocalSetup && isOnChainSetup) {
        const contract =
          ECSInstance.DDMFactoryInstance as DirectDonationManagerFactoryInterface;
        //get onchain Address
        const address = await contract.getMyDirectDonationManager();
        //setup onchain to local
        await ECSInstance.setDDManager(address);
        //auto nav to managerpage
        nav("/Manager");
      }
    }
  }

  function isWalletSetUp() {
    return ECSInstance.provider === null || ECSInstance.caller === null
      ? false
      : true;
  }

  async function setupWallet() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    ECSInstance.provider = provider;
    ECSInstance.caller = signer;
  }

  async function onConnectWalletClick() {
    try {
      await setupWallet();
      await setupDDMFactory();
      await setupDDManager();
      nav("FirstTime");
      // setTrigger(null);
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

  return { onConnectWalletClick };
}

function FrontPage() {
  const { onConnectWalletClick } = usePageState();

  if (window.ethereum === null) {
    return <Typography>Please install MetaMask</Typography>;
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
      <Card sx={{ padding: "1em" }}>
        <Typography mb={"1em"}>Connect your wallet</Typography>
        <Button variant="outlined" onClick={onConnectWalletClick}>
          <Typography>MetaMask</Typography>
        </Button>
      </Card>
    </Box>
  );
}

export default FrontPage;

//! bug ->  metamask change account
//! bug -> metamask use different network
