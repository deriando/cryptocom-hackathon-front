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
import ERC20Interface from "../../logic/ERC20";
import { Signer, providers, Contract } from "ethers";
import FormDialog, {
  FormDialogProps,
  Textbox,
  FormDialogReturn,
} from "../util/FormDialog";

export interface TokenMeta {
  contractAddress: string;
  tokenSymbol?: string;
}

function useComponentState() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [trigger, setTrigger] = useState<boolean>(false);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);
  const [tokenMetaList, setTokenMetaList] = useState<null | Array<TokenMeta>>(
    null
  );
  const [custodianFeature, setCustodianFeature] = useState<boolean>(false);

  const [dialog, setDialog] = useState<FormDialogProps>({
    open: false,
    dialogTitle: "",
    dialogContent: "",
    textboxes: [],
    actionButtonText: "",
    dialogCallback: () => {},
  });

  async function onFirstBootRun() {
    try {
      console.log(`start up Allocation Component`);
      await Promise.all([generateTokenList(), syncOnChainCustodianFeature()]);
    } catch (e) {
      console.log(e);
    }
  }

  async function generateTokenList() {
    const tokensTemplate = await getTokenList();
    const tokensData = await hydrateTokenMeta(tokensTemplate);
    setTokenMetaList(tokensData);
  }

  async function getTokenList() {
    const contract: DirectDonationInterface =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    const data = await contract.getAcceptedERC20List();
    const exportData = data.map((x) => {
      return { contractAddress: x };
    });
    return exportData;
  }

  async function hydrateTokenMeta(tokenList: Array<TokenMeta>) {
    const mapPromises = tokenList.map(async (x) => {
      const contract = new ERC20Interface(
        ECSInstance.caller as Signer,
        ECSInstance.provider as providers.Provider
      );
      await contract.setContract(x.contractAddress);
      return await contract.symbol();
    });
    const promisesData = await Promise.all(mapPromises);
    const exportData = tokenList.map((x, i) => {
      return {
        contractAddress: x.contractAddress,
        tokenSymbol: promisesData[i],
      };
    });
    return exportData;
  }

  async function getCustodianFeature() {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    return await contract.CustodianFeature();
  }

  async function syncOnChainCustodianFeature() {
    const custodianFeature = await getCustodianFeature();
    setCustodianFeature(custodianFeature);
  }

  async function setOnChainCustodianFeature(state: boolean) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    await contract.setCustodianFeature(
      state,
      setOnChainCustodianFeatureCallback
    );
  }

  async function setOnChainCustodianFeatureCallback(data: any) {
    //data on not in use
    syncOnChainCustodianFeature();
  }

  async function toggleCustodianFeatureSwitch() {
    await setOnChainCustodianFeature(!custodianFeature);
  }

  async function onPayoutButtonClick(tokenAddress: string) {
    try {
      const totalSum = await getCurrentBalance(tokenAddress);
      await payoutContractBalance(tokenAddress, totalSum);
    } catch (e) {
      console.log(e);
    }
  }

  async function getCurrentBalance(tokenAddress: string) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    const contractAddress = (contract._directDonationContract as Contract)
      .address;
    if (tokenAddress === "") {
      return await (ECSInstance.provider as providers.Provider).getBalance(
        contractAddress
      );
    } else {
      const ERC20 = new ERC20Interface(
        ECSInstance.caller as Signer,
        ECSInstance.provider as providers.Provider
      );
      await ERC20.setContract(tokenAddress);
      return await ERC20.balanceOf(contractAddress);
    }
  }

  async function payoutContractBalance(tokenAddress: string, sum: number) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    if (tokenAddress === "")
      await contract.payoutContractBalance(
        sum,
        undefined,
        payoutContractBalanceCallback
      );
    else
      await contract.payoutContractBalance(
        sum,
        tokenAddress,
        payoutContractBalanceCallback
      );
  }

  async function payoutContractBalanceCallback(data: any) {
    await generateTokenList();
  }

  async function onWithdrawButtonClick(tokenAddress: string) {
    // try{
    //   const totalSum = await getCurrentBalance(tokenAddress);
    //   await withdrawContractBalance(tokenAddress, totalSum);
    // }catch(e){
    //   console.log(e);
    // }
  }
  async function withdrawContractBalance() {}

  async function withdrawContractBalanceCallback() {}

  async function onDeleteButtonClick(tokenAddress: string) {
    try {
      await deleteAcceptedERC20(tokenAddress);
    } catch (e) {
      console.log(e);
    }
  }

  async function deleteAcceptedERC20(tokenAddress: string) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    await contract.deleteAcceptedERC20(
      tokenAddress,
      deleteAcceptedERC20Callback
    );
  }

  async function deleteAcceptedERC20Callback() {
    // try new callback
    await generateTokenList();
  }

  async function onCreateButtonClick() {
    //Dialog Widget call
    setDialog((x) => {
      x.open = true;
      (x.dialogTitle = "Add An Accepted Token"),
        (x.dialogContent = "Enter your Token Address to start accepting them."),
        (x.actionButtonText = "Create"),
        (x.dialogCallback = onDialogCallback);
      x.textboxes = [
        {
          label: "Token Address",
          type: "",
        },
      ];
      return x;
    });
    setTrigger((x) => !x);

    async function onDialogCallback(dataForm: FormDialogReturn) {
      setDialog((x) => {
        x.open = false;
        x.dialogCallback = () => {};
        return x;
      });
      setTrigger((x) => !x);

      if (dataForm.returnType === "ClickedAction") {
        try {
          const tokenAddress: string = (
            dataForm.dialogValue as Array<Textbox>
          )[0].value as string;
          await setAcceptedERC20(tokenAddress);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  async function setAcceptedERC20(tokenAddress: string) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    await contract.setAcceptedERC20(tokenAddress, setAcceptedERC20Callback);
  }

  async function setAcceptedERC20Callback(data: any) {
    await generateTokenList();
  }

  useEffect(() => {
    if (firstBoot) {
      onFirstBootRun();
      setFirstBoot(false);
    }
  });
  return {
    dialog,
    tokenMetaList,
    custodianFeature,
    toggleCustodianFeatureSwitch,
    onCreateButtonClick,
    onDeleteButtonClick,
    onPayoutButtonClick,
  };
}

interface GeneralSettingProps {
  tokens: Array<TokenMeta>;
  reloadTokens: Function;
}

function GeneralSetting() {
  //Hooks
  const [selected, setSelected] = useState("");
  const {
    dialog,
    tokenMetaList,
    custodianFeature,
    toggleCustodianFeatureSwitch,
    onCreateButtonClick,
    onDeleteButtonClick,
    onPayoutButtonClick,
  } = useComponentState();
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
              <ListItemText
                primary={x.tokenSymbol}
                secondary={x.contractAddress}
              />
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
                  onClick={() => {
                    onPayoutButtonClick(x.contractAddress);
                  }}
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
                onClick={() => {
                  onPayoutButtonClick("");
                }}
              >
                Payout
              </Button>
              <Button>Withdraw</Button>
            </ButtonGroup>
          </Box>
        </ListItem>
        {ItemGenerator()}
        {/* {NoTokenLayout()} */}
      </List>
    );
  }

  return (
    <>
      <FormDialog
        open={dialog.open}
        dialogTitle={dialog.dialogTitle}
        dialogContent={dialog.dialogContent}
        textboxes={dialog.textboxes}
        actionButtonText={dialog.actionButtonText}
        dialogCallback={dialog.dialogCallback}
      ></FormDialog>
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
              <Button
                onClick={() => {
                  onDeleteButtonClick(selected);
                }}
                disabled={selected === "" ? true : false}
              >
                Delete
              </Button>
              <Button onClick={onCreateButtonClick}>Create</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
export default GeneralSetting;
