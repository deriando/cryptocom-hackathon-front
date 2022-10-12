import { createContext, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Typography,
  Container,
  List,
  CardActionArea,
  Divider,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";
import DirectDonationManagerInterface from "./logic/DirectDonationManager";

//* may add name in contract in future  */
interface DonationItemMeta {
  contractAddress: string;
}

function usePageState() {
  //use to update page to render when completing setup
  const ECSInstance = EventControllerSingleton.getInstance();
  const [trigger, setTrigger] = useState<null>(null);
  const [firstBoot, setFirstBoot] = useState<boolean>(true); //only true / false state

  const [donationList, setDonationList] =
    useState<null | Array<DonationItemMeta>>(null); //only null, [], [<someItems>]

  const nav = useNavigate();

  async function onFirstBootRun() {
    try {
      console.log(`start up Manager Page`);
      redirectForMissingData();
      await generateDonationList();
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
    if (!isLocalDDMFactorySetUp() || !isWalletSetUp()) {
      nav("/");
    }
    if (!isLocalDDManagerSetUp()) {
      nav("/FirstTime");
    }
  }

  async function generateDonationList() {
    const contract: DirectDonationManagerInterface =
      ECSInstance.DDManagerInstance as DirectDonationManagerInterface;
    const data = await contract.getDirectDonationList();
    const exportData = data.map((x) => {
      return { contractAddress: x };
    });
    setDonationList(exportData);
  }

  async function removeDirectDonation(contractAddress: string) {
    const contract: DirectDonationManagerInterface =
      ECSInstance.DDManagerInstance as DirectDonationManagerInterface;
    await contract.removeDirectDonation(
      contractAddress,
      removeDirectDonationCallback
    );
  }

  async function removeDirectDonationCallback(data: any) {
    //no use of return data
    console.log(data);
    await generateDonationList();
  }

  async function onDeleteButtonClick(contractAddress: string) {
    if (contractAddress !== "") {
      try {
        await removeDirectDonation(contractAddress);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function setupDirectDonation(contractAddress: string) {
    if (isWalletSetUp()) {
      await ECSInstance.setDirectDonation(contractAddress);
      nav(`/Donation/${contractAddress}`);
    }
  }

  async function onModifyButtonClick(contractAddress: string) {
    if (contractAddress !== "") {
      try {
        setupDirectDonation(contractAddress);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function createDirectDonation() {
    const contract: DirectDonationManagerInterface =
      ECSInstance.DDManagerInstance as DirectDonationManagerInterface;
    await contract.createDirectDonation(createDirectDonationCallback);
  }

  async function createDirectDonationCallback(data: any) {
    //no use of return data
    console.log(data);
    await generateDonationList();
  }

  async function onCreateButtonClick() {
    try {
      createDirectDonation();
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
  return {
    donationList,
    onCreateButtonClick,
    onDeleteButtonClick,
    onModifyButtonClick,
  };
}

function ManagerCreationCard() {
  const {
    donationList,
    onCreateButtonClick,
    onDeleteButtonClick,
    onModifyButtonClick,
  } = usePageState();
  const [selectedIndex, setSelectedIndex] = useState("");

  function ListView() {
    const handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: string
    ) => {
      setSelectedIndex(index);
    };

    function ItemGenerator() {
      const items = (donationList as Array<DonationItemMeta>).map((x) => {
        return (
          <ListItemButton
            key={x.contractAddress}
            selected={selectedIndex === x.contractAddress}
            onClick={(event) => handleListItemClick(event, x.contractAddress)}
          >
            <ListItemText primary={x.contractAddress} />
          </ListItemButton>
        );
      });
      return items;
    }

    if (donationList === null)
      return <Typography mb={"1em"}>loading!</Typography>;
    if (donationList.length === 0)
      return <Typography mb={"1em"}>Create Your Donation Widget!</Typography>;
    return (
      <Container
        sx={{
          width: "80%",
          margin: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 360 }}>
          <List component="nav" aria-label="main mailbox folders">
            {ItemGenerator()}
          </List>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Card
        sx={{
          marginTop: "20%",
          alignItems: "center",
          textAlign: "center",
          width: "50%",
          marginLeft: "25%",
        }}
      >
        {ListView()}

        <Container sx={{ padding: "20px 0px 20px 0px" }}>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            onClick={() => onDeleteButtonClick(selectedIndex)}
            disabled={selectedIndex === ""}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            onClick={() => onModifyButtonClick(selectedIndex)}
            disabled={selectedIndex === ""}
          >
            Modify
          </Button>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            onClick={() => onCreateButtonClick()}
          >
            Create New
          </Button>
        </Container>
      </Card>
    </Container>
  );
}

function ManagerPage() {
  if (window.ethereum === null)
    return <Typography>Please install MetaMask</Typography>;

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      textAlign={"center"}
      minHeight={"100vh"}
    >
      <ManagerCreationCard />
    </Box>
  );
}

export default ManagerPage;
