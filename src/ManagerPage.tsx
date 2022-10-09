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

interface StateData {
  directDonationAddresses?: Array<string>;
  errorMessage?: any;
}

function useDDListData() {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateData, setStateData] = useState<StateData | undefined>(undefined);

  ECSInstance.getDirectDonationList()
    .then((data) => {
      setStateData(data);
    })
    .catch((e) => {
      setStateData({
        errorMessage: e,
      });
    });

  return stateData;
}

function ManagerCreationCard() {
  const nav = useNavigate();
  const ECSInstance = EventControllerSingleton.getInstance();

  const stateData = useDDListData();
  const [selectedIndex, setSelectedIndex] = useState("");

  function ListOfDonations() {
    const handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: string
    ) => {
      setSelectedIndex(index);
    };

    function itemsList() {
      const addressList = (stateData as StateData)
        .directDonationAddresses as Array<string>;
      const items = addressList.map((x) => {
        return (
          <ListItemButton
            key={x}
            selected={selectedIndex === x}
            onClick={(event) => handleListItemClick(event, x)}
          >
            <ListItemText primary={x} />
          </ListItemButton>
        );
      });
      return items;
    }

    //console.log(stateData);
    if (stateData === undefined || Object.keys(stateData).length === 0) {
      return <Typography mb={"1em"}>loading!</Typography>;
    }

    if (stateData.hasOwnProperty("errorMessage")) {
      return <Typography mb={"1em"}>Something has when wrong!</Typography>;
    }

    if ((stateData.directDonationAddresses as Array<string>).length === 0) {
      return <Typography mb={"1em"}>Create Your Donation Widget!</Typography>;
    }

    return (
      <Container
        sx={{
          width: "80%",
          margin: "auto",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 360 }}>
          <List component="nav" aria-label="main mailbox folders">
            {itemsList()}
          </List>
        </Box>
      </Container>
    );
  }

  function buttons() {
    if (selectedIndex === "") {
      return (
        <Container>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            disabled
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            disabled
          >
            Modify
          </Button>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            onClick={createDirectDonation}
          >
            Create New
          </Button>
        </Container>
      );
    } else {
      return (
        <Container>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            onClick={removeDirectDonation}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            onClick={modifyDirectDonation}
          >
            Modify
          </Button>
          <Button
            variant="outlined"
            sx={{ padding: "1px 5px 1px 5px", margin: "0px 5px 0px 5px" }}
            onClick={createDirectDonation}
          >
            Create New
          </Button>
        </Container>
      );
    }
  }
  async function removeDirectDonation() {
    console.log(selectedIndex);
    if (selectedIndex === "") return;
    const data = await ECSInstance.removeDirectDonation(selectedIndex);
    console.log(data);
  }

  async function createDirectDonation() {
    const data = await ECSInstance.createDirectDonation();
    console.log(data);
  }

  async function modifyDirectDonation() {
    nav("/Donation");
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
        {ListOfDonations()}

        <Container sx={{ padding: "20px 0px 20px 0px" }}>{buttons()}</Container>
      </Card>
    </Container>
  );
}

function ManagerPage() {
  function logic() {
    // @ts-ignore
    if (window.ethereum === null) {
      return <Typography>Please install MetaMask</Typography>;
    }
    return <ManagerCreationCard />;
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
      {logic()}
    </Box>
  );
}

export default ManagerPage;
