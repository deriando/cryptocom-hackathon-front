import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Divider,
  Switch,
  ButtonGroup,
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  CardContent,
  FormControlLabel,
} from "@mui/material";

import EventControllerSingleton from "../../logic/EventController";
import DirectDonationInterface from "../../logic/DirectDonation";

// function useCustodianFeature() {
//   const ECSInstance = EventControllerSingleton.getInstance();
//   const [custodianFeature, setCustodianFeature] = useState<boolean>(false);

//   function waitingCustodianFeature() {
//     // ECSInstance.getCustodianFeature()
//     // .then((data) => {
//     //   setCustodianFeature(data.custodianFeature === undefined? false: data.custodianFeature);
//     // })
//     // .catch((e) => {
//     setCustodianFeature(false);
//     //   console.log({
//     //     errorMessage: e,
//     //   });
//     // });
//   }

//   function toggleCustodianFeature() {
//     ECSInstance.setCustodianFeature(!custodianFeature)
//       .then((data) => {
//         console.log(data);
//       })
//       .catch((e) => {
//         console.log({
//           errorMessage: e,
//         });
//       });
//   }

//   useEffect(() => {
//     waitingCustodianFeature();
//   }, [custodianFeature]);

//   return { custodianFeature, toggleCustodianFeature };
// }

export interface TokenMeta {
  contractAddress: string;
  tokenSymbol?: string;
}

function useComponentState(Tokens: Array<TokenMeta>, reloadTokens: Function) {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [trigger, setTrigger] = useState<null>(null);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);
  const [tokenMetaList, setTokenMetaList] = useState<null | Array<TokenMeta>>(
    null
  );
  const [custodianFeature, setCustodianFeature] = useState<boolean>(false);

  async function onFirstBootRun() {
    try {
      console.log(`start up Allocation Component`);
      await Promise.all([hydrateTokenMeta(), syncCustodianFeature()]);
    } catch (e) {
      console.log(e);
    }
  }

  async function hydrateTokenMeta() {
    const contract = ECSInstance.DirectDonationInstance;
    const mapPromises = Tokens.map((x) => {
      return (contract as DirectDonationInterface).getAllocationValue(
        x.contractAddress
      );
    });
    const promisesData = await Promise.all(mapPromises);
    const exportData = Tokens.map((x, i) => {
      return {
        contractAddress: x.contractAddress,
        percentValue: promisesData[i],
      };
    });
  }

  async function getOnChainCustodianFeature() {}

  async function syncCustodianFeature() {}

  async function toggleCustodianFeatureSwitch() {}

  async function onPayoutButtonClick() {}

  async function onWithdrawButtonClick() {}

  async function onDeleteButtonClick() {}

  async function onCreateButtonClick() {}

  useEffect(() => {
    if (firstBoot) {
      onFirstBootRun();
      setFirstBoot(false);
    }
  });
  return { tokenMetaList, custodianFeature, toggleCustodianFeatureSwitch };
}

interface GeneralSettingProps {
  tokens: Array<TokenMeta>;
  reloadTokens: Function;
}

function GeneralSetting(props: GeneralSettingProps) {
  //Hooks
  const [selected, setSelected] = useState("");
  const { tokenMetaList, custodianFeature, toggleCustodianFeatureSwitch } =
    useComponentState(props.tokens, props.reloadTokens);
  // const addressList = props.contractAddresses;

  function ListView() {
    const handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: string
    ) => {
      if (index === selected) setSelected("");
      else setSelected(index);
    };

    function ItemGenerator() {
      // Individual Item React Component
      const items = (tokenMetaList as Array<TokenMeta>).map((x) => {
        return (
          <ListItemButton
            key={x.contractAddress}
            selected={selected === x.contractAddress}
            onClick={(event) => handleListItemClick(event, x.contractAddress)}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <ListItemText primary={x.tokenSymbol} />
              <ButtonGroup
                sx={{ ml: 2 }}
                size="small"
                variant="outlined"
                aria-label="outlined button group sx"
              >
                <Button
                  disabled={
                    custodianFeature == false || custodianFeature == undefined
                      ? true
                      : false
                  }
                >
                  Payout
                </Button>
                <Button>Withdraw</Button>
              </ButtonGroup>
            </Box>
          </ListItemButton>
        );
      });
      return items;
    }

    function NoTokenLayout() {
      if ((tokenMetaList as Array<TokenMeta>).length > 0) {
        return (
          <Box>
            <Divider></Divider>
            <ListItem key={"All Token"}>
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
                  <Button
                    disabled={
                      custodianFeature == false || custodianFeature == undefined
                        ? true
                        : false
                    }
                  >
                    Payout
                  </Button>
                  <Button>Withdraw</Button>
                </ButtonGroup>
              </Box>
            </ListItem>
          </Box>
        );
      }
      return <></>;
    }

    if (tokenMetaList === null) {
      return <Typography mb={"1em"}>loading!</Typography>;
    }

    return (
      <List
        component="nav"
        aria-label="main mailbox folders"
        sx={{ m: 1, maxHeight: 250, overflow: "auto" }}
      >
        <ListItem key={"Ethers"}>
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
              <Button
                disabled={
                  custodianFeature == false || custodianFeature == undefined
                    ? true
                    : false
                }
              >
                Payout
              </Button>
              <Button>Withdraw</Button>
            </ButtonGroup>
          </Box>
        </ListItem>
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
                checked={custodianFeature}
                onChange={() => {
                  toggleCustodianFeatureSwitch();
                }}
              />
            }
            label="Custodian Feature"
          />

          <Box>
            <Button disabled={selected === "" ? true : false}>Delete</Button>
            <Button>Create</Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default GeneralSetting;
