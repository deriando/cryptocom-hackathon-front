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
import EventControllerSingleton from "../../logic/EventController";
import { truncate } from "fs";

interface TokenMeta {
  tokenAddress: string;
  tokenSymbol: string;
}

function useTokenMeta(address: string) {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [tokenMeta, setTokenMeta] = useState<TokenMeta>({
    tokenAddress: address,
    tokenSymbol: "",
  });
  const [isInitialRender, setIsInitialRender] = useState(true);

  function waitToken() {
    ECSInstance.getERC20Symbol(address)
      .then((data) => {
        setTokenMeta(data);
      })
      .catch((e) => {
        setTokenMeta({
          tokenAddress: address,
          tokenSymbol: "",
        });
        console.log({
          errorMessage: e,
        });
      });
  }

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      waitToken();
    }
  }, [tokenMeta, isInitialRender]);

  return tokenMeta;
}

function useCustodianFeature() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [custodianFeature, setCustodianFeature] = useState<boolean>(false);

  function waitingCustodianFeature() {
    // ECSInstance.getCustodianFeature()
    // .then((data) => {
    //   setCustodianFeature(data.custodianFeature === undefined? false: data.custodianFeature);
    // })
    // .catch((e) => {
    setCustodianFeature(false);
    //   console.log({
    //     errorMessage: e,
    //   });
    // });
  }

  function toggleCustodianFeature() {
    ECSInstance.setCustodianFeature(!custodianFeature)
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log({
          errorMessage: e,
        });
      });
  }

  useEffect(() => {
    waitingCustodianFeature();
  }, [custodianFeature]);

  return { custodianFeature, toggleCustodianFeature };
}

interface GeneralSettingProps {
  tokenAddresses: Array<string>;
}

interface ItemProps {
  tokenAddress: string;
  tokenSymbol: string;
}

function GeneralSetting(props: GeneralSettingProps) {
  //Hooks
  const [selected, setSelected] = useState("");
  const { custodianFeature, toggleCustodianFeature } = useCustodianFeature();
  const addressList = props.tokenAddresses;

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: string
  ) => {
    if (index === selected) setSelected("");
    else setSelected(index);
  };

  function ListView() {
    function ItemGenerator() {
      // Individual Item React Component
      function Item(props: ItemProps) {
        return (
          <ListItemButton
            key={props.tokenAddress}
            selected={selected === props.tokenAddress}
            onClick={(event) => handleListItemClick(event, props.tokenAddress)}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <ListItemText primary={props.tokenSymbol} />
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
      }
      //build list of Indivdual Item
      const items = addressList.map((x) => {
        const itemMeta = useTokenMeta(x);
        return (
          <Item
            key={itemMeta.tokenAddress}
            tokenAddress={itemMeta.tokenAddress}
            tokenSymbol={itemMeta.tokenSymbol}
          />
        );
      });
      return items;
    }

    function NoTokenLayout() {
      if (addressList.length !== 0) {
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

    if (addressList === undefined) {
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

  function MainControls() {
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
              checked={custodianFeature}
              onChange={() => {
                toggleCustodianFeature();
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

export default GeneralSetting;
