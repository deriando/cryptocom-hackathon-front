import { createContext, useContext, useState, useEffect } from "react";
import { Box, Typography, Divider, Paper } from "@mui/material";

import { useNavigate, useNavigation, useParams } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";

import GeneralSetting, {
  TokenMeta,
} from "./components/DonationPage/GeneralSetting";
import AllocationSetting, {
  AllocationMeta,
} from "./components/DonationPage/AllocationSetting";
import CallToActionCard from "./components/DonationPage/CallToActionCard";
import DirectDonationInterface from "./logic/DirectDonation";

function usePageState() {
  const pageParams = useParams();
  const contractAddress: string = pageParams.contractAddress as string;

  const ECSInstance = EventControllerSingleton.getInstance();
  const [trigger, setTrigger] = useState<null>(null);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);
  const nav = useNavigate();

  async function onFirstBootRun() {
    try {
      console.log(`start up Contract Page`);
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

  function isLocalDirectDonationSetUp() {
    return ECSInstance.DirectDonationInstance === null ? false : true;
  }

  function redirectForMissingData() {
    if (!isLocalDDMFactorySetUp() || !isWalletSetUp()) {
      nav("/");
    }
    if (!isLocalDDManagerSetUp()) {
      nav("/FirstTime");
    }
    if (!isLocalDirectDonationSetUp()) {
      nav("/Manager");
    }
  }

  useEffect(() => {
    if (firstBoot) {
      onFirstBootRun();
      setFirstBoot(false);
    }
  });
  return {
    contractAddress,
  };
}

function DonationPage() {
  const { contractAddress } = usePageState();

  if (window.ethereum === null)
    return (
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
      >
        <Typography>Please install MetaMask</Typography>
      </Box>
    );

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      minHeight={"100vh"}
    >
      <Paper elevation={0}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
          textAlign={"center"}
          sx={{ ml: 1, mb: 1 }}
        >
          <Typography variant="h5">Donation Contract</Typography>
          <Typography variant="body1">
            {`Contract Address: ${contractAddress}`}
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={"flex-start"}
          textAlign={"center"}
        >
          <GeneralSetting></GeneralSetting>
          <AllocationSetting></AllocationSetting>
        </Box>
        <Divider></Divider>

        <CallToActionCard contractAddress={contractAddress} />
      </Paper>
    </Box>
  );
}

export default DonationPage;
