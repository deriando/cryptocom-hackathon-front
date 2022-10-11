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

interface AllocationMeta {
  walletAddress: string;
  percentValue: number;
}

function useAllocationMeta(address: string) {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [stateData, setStateData] = useState<AllocationMeta>({
    walletAddress: "0x000001",
    percentValue: 10.0,
  });

  //   return { Allocations: [
  //     { walletAddress: "0x000001", percentValue: 10.0 },
  //     { walletAddress: "0x000002", percentValue: 20.05 },
  //   ],
  // };

  function waitData() {
    const promise = new Promise(function (resolve) {
      setTimeout(resolve, 100);
    });
    promise.then(() => {
      setStateData({ walletAddress: "0x000001", percentValue: 10.0 });
    });
  }

  useEffect(() => {
    waitData();
  }, [stateData]);
  return stateData;
}

interface ItemProps {
  walletAddress: string;
  percentValue: number;
}

interface AllocationSettingProps {
  allocations: Array<string>;
}

function AllocationSetting(props: AllocationSettingProps) {
  const addressList = [""];

  function ListView() {
    function ItemGenerator() {
      function Item(props: ItemProps) {
        return (
          <ListItemButton
            key={props.walletAddress}
            // selected={selectedIndex === 1}
            // onClick={(event) => handleListItemClick(event, x.walletAddress)}
          >
            <Box
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <ListItemText primary={String(props.walletAddress)} />
              <TextField
                id="outlined-basic"
                label={`${props.percentValue}%`}
                variant="outlined"
                size="small"
                sx={{ width: 100 }}
              />
            </Box>
          </ListItemButton>
        );
      }

      const items = addressList.map((x) => {
        const itemMeta = useAllocationMeta(x);
        return (
          <Item
            key={itemMeta.walletAddress}
            walletAddress={itemMeta.walletAddress}
            percentValue={itemMeta.percentValue}
          />
        );
      });

      return items;
    }

    function UnallocatedPecentageCalculation() {
      if (addressList.length !== 0) {
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

    if (addressList === undefined) {
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

function GeneralSetting() {}

export default AllocationSetting;
