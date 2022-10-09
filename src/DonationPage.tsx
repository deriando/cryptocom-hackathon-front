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

interface TokenListData {
  tokenMetas?: Array<TokenMeta>;
  errorMessage?: any;
}

interface TokenMeta {
  tokenAddress: string;
  tokenSymbol: string;
}

interface PercentListData {
  Allocations?: Array<Allocation>;
  errorMessage?: any;
}

interface Allocation {
  walletAddress: string;
  percentValue: number;
}

function useTokenList() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateData, setStateData] = useState<TokenListData | undefined>(
    undefined
  );
  // async get TokenList

  return {
    tokenMetas: [
      { tokenAddress: "0x000001", tokenSymbol: "TOK1" },
      { tokenAddress: "0x000002", tokenSymbol: "TOK2" },
    ],
  };
  return stateData;
}

function usePercentList(address: string) {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateData, setStateData] = useState<PercentListData | undefined>(
    undefined
  );
  // async get TokenList

  return {
    Allocations: [
      { walletAddress: "0x000001", percentValue: 10.0 },
      { walletAddress: "0x000002", percentValue: 20.05 },
    ],
  };
  return stateData;
}

function useCustodianFeature() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateBool, setStateBool] = useState<boolean | undefined>(undefined);

  ECSInstance.getCustodianFeature()
    .then((data) => {
      console.log(data);
      setStateBool(data.custodianFeature);
    })
    .catch((e) => {
      console.log({
        errorMessage: e,
      });
      setStateBool(undefined);
    });

  return stateBool;
}

function DonationPage() {
  const ECSInstance = EventControllerSingleton.getInstance();

  const pageParams = useParams();
  const contractAddress = pageParams.contractAddress;

  const actualCustodianFeature = useCustodianFeature();

  async function setActualCutodianFeature(state: boolean) {
    try {
      await ECSInstance.setCustodianFeature(state);
    } catch (e) {
      return {
        errorMessage: e,
      };
    }
  }

  function GeneralSetting() {
    const [selected, setSelected] = useState("");

    const handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: string
    ) => {
      if (index === selected) setSelected("");
      else setSelected(index);
    };
    function ListView() {
      const stateData = useTokenList();

      function ItemGenerator() {
        const addressList = (stateData as TokenListData)
          .tokenMetas as Array<TokenMeta>;

        function disablePayout() {
          if (
            actualCustodianFeature == false ||
            actualCustodianFeature == undefined
          )
            return <Button disabled>Payout</Button>;
          return <Button>Payout</Button>;
        }
        const items = addressList.map((x) => {
          return (
            <ListItemButton
              key={x.tokenAddress}
              selected={selected === x.tokenAddress}
              onClick={(event) => handleListItemClick(event, x.tokenAddress)}
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
                  {disablePayout()}
                  <Button>Withdraw</Button>
                </ButtonGroup>
              </Box>
            </ListItemButton>
          );
        });

        return items;
      }

      function NoTokenLayout() {
        function disablePayout() {
          if (
            actualCustodianFeature == false ||
            actualCustodianFeature == undefined
          )
            return <Button disabled>Payout</Button>;
          return <Button>Payout</Button>;
        }

        if ((stateData?.tokenMetas as Array<TokenMeta>).length !== 0) {
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
                    {disablePayout()}
                    <Button>Withdraw</Button>
                  </ButtonGroup>
                </Box>
              </ListItem>
            </Box>
          );
        }
        return <></>;
      }

      function disablePayout() {
        if (
          actualCustodianFeature == false ||
          actualCustodianFeature == undefined
        )
          return <Button disabled>Payout</Button>;
        return <Button>Payout</Button>;
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
                {disablePayout()}
                <Button>Withdraw</Button>
              </ButtonGroup>
            </Box>
          </ListItem>
          {ItemGenerator()}

          {NoTokenLayout()}
        </List>
      );
    }

    function MainControls() {
      function disableDelete() {
        if (selected === "") return <Button disabled>Delete</Button>;
        return <Button>Delete</Button>;
      }

      async function toggleCustodian() {
        setActualCutodianFeature(!actualCustodianFeature).then(() => {});
      }

      return (
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
                checked={actualCustodianFeature}
                onChange={() => {
                  toggleCustodian();
                }}
              />
            }
            label="Custodian Feature"
          />

          <Box>
            {disableDelete()}
            <Button>Create</Button>
          </Box>
        </Box>
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
          {MainControls()}
        </CardContent>
      </Card>
    );
  }

  function PercentageSetting() {
    function ListView() {
      const stateData = usePercentList(contractAddress as string);

      function ItemGenerator() {
        const addressList = (stateData as PercentListData)
          .Allocations as Array<Allocation>;
        const items = addressList.map((x) => {
          return (
            <ListItemButton
              key={x.walletAddress}
              // selected={selectedIndex === 1}
              // onClick={(event) => handleListItemClick(event, x.walletAddress)}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <ListItemText primary={String(x.walletAddress)} />
                <TextField
                  id="outlined-basic"
                  label={`${x.percentValue}%`}
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
        if ((stateData?.Allocations as Array<Allocation>).length !== 0) {
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
