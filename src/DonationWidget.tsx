import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import reactLogo from "./assets/react.svg";

import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  CardContent,
  TextField,
  Typography,
  Select,
} from "@mui/material";
import { ethers, Contract, providers, Signer, BigNumber } from "ethers";
import { padding } from "@mui/system";
import { alignProperty } from "@mui/material/styles/cssUtils";
import DirectDonationInterface from "./logic/DirectDonation";
import ERC20Interface from "./logic/ERC20";

interface TokenMeta {
  contractAddress: string;
  tokenSymbol?: string;
}

function usePageState() {
  const pageParams = useParams();
  const contractAddress: string = pageParams.contractAddress as string;
  //use to update page to render when completing setup
  const provider = useRef<providers.JsonRpcProvider | null>(null);
  const donation = useRef<DirectDonationInterface | null>(null);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);

  const [tokenMetaList, setTokenMetaList] = useState<null | Array<TokenMeta>>(
    null
  );

  async function onConnectWalletClick() {
    try {
      console.log("setting Wallet");
      await setupWallet();
      console.log("setting Donation Contract");
      await setupDonation();
      console.log("setting TokenList");
      await generateTokenList();
    } catch (e) {
      console.log(e);
    }
  }

  async function setupWallet() {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const signer = _provider.getSigner();
    provider.current = _provider;
  }

  async function setupDonation() {
    if (provider.current === null) return;
    const _contract = new DirectDonationInterface(
      provider.current.getSigner(),
      provider.current
    );
    await _contract.setContract(contractAddress);
    donation.current = _contract;
  }

  async function generateTokenList() {
    if (donation.current === null || provider.current === null) return;
    const tokensTemplate = await getTokenList();
    const tokensData = await hydrateTokenMeta(tokensTemplate);
    setTokenMetaList(tokensData);
  }

  async function getTokenList(): Promise<TokenMeta[]> {
    if (donation.current === null || provider.current === null) return [];
    const data = await donation.current.getAcceptedERC20List();
    const exportData = data.map((x) => {
      return { contractAddress: x };
    });
    return exportData;
  }

  async function hydrateTokenMeta(
    tokenList: Array<TokenMeta>
  ): Promise<TokenMeta[]> {
    if (donation === null || provider === null) return [];
    const mapPromises = tokenList.map(async (x) => {
      const contract = new ERC20Interface(
        (provider.current as providers.JsonRpcProvider).getSigner() as Signer,
        provider.current as providers.JsonRpcProvider
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

  async function onDonationClick(tokenAddress: string, sum: BigNumber) {
    try {
      console;
      console.log(sum);
      await donate(tokenAddress, sum);
    } catch (e) {
      console.log(e);
    }
  }

  async function donate(tokenAddress: string, sum: BigNumber) {
    if (donation.current === null) return;
    if (tokenAddress === "") {
      await donation.current.donateEther(sum, donateCallback);
    } else {
      await increaseAllowance(tokenAddress, sum);
      await donation.current.donateToken(tokenAddress, sum, donateCallback);
    }
  }

  async function increaseAllowance(tokenAddress: string, amount: BigNumber) {
    const contract = new ERC20Interface(
      (provider.current as providers.JsonRpcProvider).getSigner() as Signer,
      provider.current as providers.JsonRpcProvider
    );
    await contract.setContract(tokenAddress);
    await contract.increaseAllowance(contractAddress, amount);
  }

  async function donateCallback(data: any) {
    await generateTokenList();
  }

  function isConnected() {
    return !(provider.current === null || donation.current === null);
  }

  return { tokenMetaList, isConnected, onConnectWalletClick, onDonationClick };
}

function DonationWidget() {
  const [select, setSelect] = useState<TokenMeta>({
    contractAddress: "",
    tokenSymbol: "Ether",
  });
  const [selectSymbol, setSelectSymbol] = useState("");
  const [value, setValue] = useState("");
  const { tokenMetaList, isConnected, onConnectWalletClick, onDonationClick } =
    usePageState();

  const handleDropdownChange = (event: SelectChangeEvent) => {
    const value: string = event.target.value;
    if (value == "Ether") {
      setSelect({
        contractAddress: "",
        tokenSymbol: "Ether",
      });
    }

    const findTokenMeta = tokenMetaList?.find(
      (item) => item.tokenSymbol === value
    );
    if (findTokenMeta === undefined) {
      setSelect({
        contractAddress: "",
        tokenSymbol: "Ether",
      });
    } else {
      setSelect(findTokenMeta);
    }
  };

  function menuItemDropdown() {
    let localList: Array<TokenMeta>;
    if (tokenMetaList === null) {
      localList = [];
    } else {
      localList = tokenMetaList;
    }

    function TokenList() {
      return localList.map((x) => {
        return (
          <MenuItem key={x.contractAddress} value={x.tokenSymbol}>
            {" "}
            {x.tokenSymbol}
          </MenuItem>
        );
      });
    }

    return (
      <FormControl variant="filled" sx={{ ml: 1, width: 110 }}>
        <InputLabel id="demo-simple-select-filled-label">Token</InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={select.tokenSymbol}
          onChange={handleDropdownChange}
        >
          <MenuItem value="Ether">Ether</MenuItem>
          {TokenList()}
        </Select>
      </FormControl>
    );
  }

  function actionButton() {
    if (isConnected())
      return (
        <Button
          onClick={() => {
            console.log(select.contractAddress);
            onDonationClick(
              select.contractAddress,
              BigNumber.from(value + "000000000000000000")
            );
          }}
        >
          Donate
        </Button>
      );
    return <Button onClick={onConnectWalletClick}>Connect</Button>;
  }

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      width={"100%"}
      textAlign={"center"}
    >
      <Card
        sx={{
          marginTop: "20%",
          minWidth: "300px",
          width: "40%",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <CardContent sx={{ m: 1 }}>
          <Typography variant="h6">Donation Wallet</Typography>

          <Box
            sx={{
              marginTop: "20px",
              display: "inline-flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <FormControl
              sx={{
                width: "100%",
              }}
            >
              <Box display={"flex"} flexDirection={"row"}>
                <TextField
                  sx={{ flexGrow: 1 }}
                  id="Filled-basic"
                  label="Enter Amount"
                  variant="filled"
                  type="number"
                  onChange={(x) => {
                    setValue(x.target.value);
                  }}
                  inputProps={{ min: "0" }}
                ></TextField>
                {menuItemDropdown()}
              </Box>
            </FormControl>
          </Box>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            {actionButton()}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DonationWidget;
