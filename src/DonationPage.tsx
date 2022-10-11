import { createContext, useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Typography,
  Container,
  Divider,
  Switch,
  ButtonGroup,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  CardContent,
  TextField,
  Paper,
  CardActions,
  FormControlLabel,
} from "@mui/material";

import { useNavigate, useNavigation, useParams } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";
import { truncate } from "fs";

import GeneralSetting from "./components/DonationPage/GeneralSetting";
import AllocationSetting from "./components/DonationPage/AllocationSetting";
import CallToActionCard from "./components/DonationPage/CallToActionCard";

// interface PageStore {
//     tokenAddresses: Array<string>;
//     walletAddresses: Array<string>;
// }

// function usePageStore() {
//   const ECSInstance = EventControllerSingleton.getInstance();
//   const [pageStore, setPageStore] = useState<PageStore| undefined >(undefined);

//   async function waitPageStore() {

//     }catch(e){
//       console.log(e);
//     }
//   }

//   async function waitTokenAddressList() {
//     return await ECSInstance.getSupportedTokenList();
//   }

//   async function waitWalletAddressList(){
//       return ([ "0x000001", "0x000002"]);
//   }

//   useEffect(()=>{
//     waitPageStore();
//   });

//   return pageStore;
// }

function useTokenAddressList() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [tokenAddressList, setTokenAddressList] = useState<
    Array<string> | undefined
  >(undefined);
  // async get TokenList
  function waitTokenList() {
    ECSInstance.getSupportedTokenList()
      .then((data) => {
        setTokenAddressList(data.tokenAddresses);
      })
      .catch((e) => {
        console.log({
          errorMessage: e,
        });
        setTokenAddressList([]);
      });
  }

  useEffect(() => {
    waitTokenList();
  }, [tokenAddressList]);

  return tokenAddressList;
}

function usePercentList() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateData, setStateData] = useState<Array<string> | undefined>(
    undefined
  );

  function waitData() {
    const promise = new Promise(function (resolve) {
      setTimeout(resolve, 100);
    });
    promise.then(() => {
      setStateData(["0x000001", "0x000002"]);
    });
  }

  useEffect(() => {
    waitData();
  }, [stateData]);
  return stateData;
}

function DonationPage() {
  const pageParams = useParams();
  const contractAddress: string = pageParams.contractAddress as string;
  // const pageStore = usePageStore();
  const tokenAddresses = useTokenAddressList();
  const percentAddresses = usePercentList();

  function loadingGeneralSetting() {
    if (pageStore === undefined || pageStore.tokenAddresses === undefined)
      return <Typography>Loading General Setting Card.</Typography>;
    else return <GeneralSetting tokenAddresses={pageStore.tokenAddresses} />;
  }

  function loadingAllocationSetting() {
    if (pageStore.percentAddresses === undefined)
      return <Typography>Loading General Setting Card.</Typography>;
    else return <AllocationSetting allocations={pageStore.percentAddresses} />;
  }

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
          {loadingGeneralSetting()}
          {loadingAllocationSetting()}
        </Box>
        <Divider></Divider>

        <CallToActionCard contractAddress={contractAddress} />
      </Paper>
    </Box>
  );
}

export default DonationPage;
