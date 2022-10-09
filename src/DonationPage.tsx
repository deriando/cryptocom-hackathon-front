import { createContext, useContext, useState } from "react";
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
  CardContent,
  TextField,
  Paper,
  CardActions,
  FormControlLabel,
} from "@mui/material";
import { ethers } from "ethers";
import { redirect } from "react-router-dom";
//@ts-ignore

import { useNavigate } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";
import { executionAsyncResource } from "async_hooks";

// function ConnectCard() {
//   const nav = useNavigate();

//   async function connectWallet() {
//     // A Web3Provider wraps a standard Web3 provider, which is
//     // what MetaMask injects as window.ethereum into each page
//     const provider = new ethers.providers.Web3Provider(window.ethereum);

//     // MetaMask requires requesting permission to connect users accounts
//     await provider.send("eth_requestAccounts", []);
//     const ECSInstance = EventControllerSingleton.getInstance();
//     // The MetaMask plugin also allows signing transactions to
//     // send ether and pay to change state within the blockchain.
//     // For this, you need the account signer...
//     const signer = provider.getSigner();
//     ECSInstance.setProvider(provider);
//     ECSInstance.setCaller(signer);

//     let settingFactoryResolved: boolean = false;
//     await ECSInstance.setDDMFactory().then(() => {
//       settingFactoryResolved = true;
//     });

//     if (settingFactoryResolved) {
//       let DDMExist: null | boolean = null;
//       await ECSInstance.myDirectDonationManagerExist().then((x) => {
//         DDMExist = x;
//       });

//       if (DDMExist === true) {
//         ECSInstance.getMyDirectDonationManager().then((data) => {
//           ECSInstance.setDDManager(data.contractAddress as string).then(() => {
//             nav("/Manager");
//           });
//         });
//       }

//       if (DDMExist === false) {
//         nav("/FirstTime");
//       }
//     }
//   }

//   return (
//     <Card sx={{ padding: "1em" }}>
//       <Typography mb={"1em"}>Connect your wallet</Typography>
//       <Button variant="outlined" onClick={connectWallet}>
//         <Typography>MetaMask</Typography>
//       </Button>
//     </Card>
//   );
// }

interface TokenListData {
  tokenAddresses?: Array<string>;
  errorMessage?: any;
}

function useTokenList() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateData, setStateData] = useState<StateData | undefined>(undefined);
  // async get TokenList

  return { tokenAddresses: ["1", "2"] };
  return stateData;
}

function usePrecentList(address: string) {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateData, setStateData] = useState<StateData | undefined>(undefined);
  // async get TokenList

  return { tokenAddresses: ["1", "2"] };
  return stateData;
}

function DonationPage() {
  function GeneralSetting() {
    function ListView() {
      const stateData = useTokenList();

      function ItemGenerator() {
        const addressList = (stateData as TokenListData)
          .tokenAddresses as Array<string>;
        const items = addressList.map((x) => {
          return (
            <ListItemButton
              key={x}
              // selected={selectedIndex === 1}
              // onClick={(event) => handleListItemClick(event, 1)}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <ListItemText primary={String(x)} />
                <ButtonGroup
                  sx={{ ml: 2 }}
                  size="small"
                  variant="outlined"
                  aria-label="outlined button group sx"
                >
                  <Button disabled>Payout</Button>
                  <Button>Withdraw</Button>
                </ButtonGroup>
              </Box>
            </ListItemButton>
          );
        });

        return items;
      }

      function NoTokenLayout() {
        if ((stateData.tokenAddresses as Array<string>).length !== 0) {
          return (
            <Box>
              <Divider></Divider>

              <ListItemButton
                key={1}

                // selected={selectedIndex === 1}
                // onClick={(event) => handleListItemClick(event, 1)}
              >
                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <ListItemText primary={"All Tokens"} />
                  <ButtonGroup
                    sx={{ ml: 2 }}
                    size="small"
                    variant="outlined"
                    aria-label="outlined button group sx"
                  >
                    <Button disabled>Payout</Button>
                    <Button>Withdraw</Button>
                  </ButtonGroup>
                </Box>
              </ListItemButton>
            </Box>
          );
        }
        return <></>;
      }

      if (stateData === undefined) {
        return <Typography mb={"1em"}>loading!</Typography>;
      }

      return (
        <List
          component="nav"
          aria-label="main mailbox folders"
          sx={{ m: 1, maxHeight: 250, overflow: "auto" }}
        >
          <ListItemButton
            key={1}
            // selected={selectedIndex === 1}
            // onClick={(event) => handleListItemClick(event, 1)}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <ListItemText primary={"Ethers"} />
              <ButtonGroup
                sx={{ ml: 2 }}
                size="small"
                variant="outlined"
                aria-label="outlined button group sx"
              >
                <Button disabled>Payout</Button>
                <Button>Withdraw</Button>
              </ButtonGroup>
            </Box>
          </ListItemButton>
          {ItemGenerator()}

          {NoTokenLayout()}
        </List>
      );
    }

    return (
      <Card
        sx={{
          p: 1,
          m: 1,
        }}
      >
        <CardContent>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-start"}
            width={"100%"}
            textAlign={"center"}
          >
            <Typography variant="h6" component="div">
              General Setting
            </Typography>
          </Box>
          {ListView()}
          <Box></Box>
          <Divider></Divider>
          <Box
            display={"flex"}
            flexDirection={"row"}
            flexWrap={"wrap"}
            justifyContent={"space-between"}
            alignItems={"center"}
            textAlign={"center"}
            sx={{
              mt: 1,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  // checked={checked}
                  // onChange={handleChange}
                  defaultChecked
                />
              }
              label="Custodian Feature"
            />

            <Box>
              <Button disabled>Delete</Button>
              <Button>Create</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  function PercentageSetting() {
    function ListView() {
      const stateData = useTokenList();

      function ItemGenerator() {
        const addressList = (stateData as TokenListData)
          .tokenAddresses as Array<string>;
        const items = addressList.map((x) => {
          return (
            <ListItemButton
              key={x}
              // selected={selectedIndex === 1}
              // onClick={(event) => handleListItemClick(event, 1)}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <ListItemText primary={String(x)} />
                <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  size="small"
                  sx={{ width: 100 }}
                />
              </Box>
            </ListItemButton>
          );
        });

        return items;
      }

      function UnallocatedPecentageCalculation() {
        if ((stateData.tokenAddresses as Array<string>).length !== 0) {
          return (
            <>
              <Divider></Divider>

              <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                Currrent Unallocated Percent: 33%
              </Typography>
            </>
          );
        }
        return (
          <>
            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
              Add an Allocation
            </Typography>
          </>
        );
      }

      if (stateData === undefined) {
        return <Typography mb={"1em"}>loading!</Typography>;
      }

      return (
        <List
          component="nav"
          aria-label="main mailbox folders"
          sx={{ m: 1, maxHeight: 250, overflow: "auto" }}
        >
          {ItemGenerator()}

          {UnallocatedPecentageCalculation()}
        </List>
      );
    }

    return (
      <Card
        sx={{
          p: 1,
          m: 1,
        }}
      >
        <CardContent>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-start"}
            width={"100%"}
            textAlign={"center"}
          >
            <Typography variant="h6" component="div">
              Payout Percentage Setting
            </Typography>
          </Box>
          {ListView()}
          <Box></Box>
          <Divider></Divider>
          <Box
            display={"flex"}
            flexDirection={"row"}
            flexWrap={"wrap"}
            justifyContent={"flex-end"}
            alignItems={"center"}
            textAlign={"center"}
            sx={{
              mt: 1,
            }}
          >
            <Box>
              <Button disabled>Delete</Button>
              <Button>Create</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  function UrlLinker() {
    return (
      <Card
        sx={{
          p: 1,
          m: 1,
        }}
      >
        <CardContent>
          <Typography variant={"h6"}>Share Your Donation Widget</Typography>
          <Box sx={{ pl: 5, pr: 5 }}>
            <TextField
              sx={{ mt: 1 }}
              label={"Widget link"}
              id="outlined-basic"
              variant="outlined"
              value={"http://test.com/widget/0xfnqjwflje2j3krj3i"}
              fullWidth
              size="small"
            />
            <Box
              display={"flex"}
              flexDirection={"row"}
              flexWrap={"wrap"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              textAlign={"center"}
              sx={{ mt: 1 }}
            >
              <Button size="small">Share</Button>
              <Button size="small">Go to Widget</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
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
            Contract Address: 0x000000000000000
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
          <GeneralSetting />
          <PercentageSetting />
        </Box>
        <Divider></Divider>

        <UrlLinker />
      </Paper>
    </Box>
  );
}

export default DonationPage;
