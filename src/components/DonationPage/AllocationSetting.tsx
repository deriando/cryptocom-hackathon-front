import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  CardContent,
  TextField,
} from "@mui/material";

import EventControllerSingleton from "../../logic/EventController";
import DirectDonationInterface from "../../logic/DirectDonation";

export interface AllocationMeta {
  walletAddress: string;
  percentValue?: number;
}

function useComponentState(
  Allocations: Array<AllocationMeta>,
  reloadAllocations: Function
) {
  const ECSInstance = EventControllerSingleton.getInstance();
  const [trigger, setTrigger] = useState<null>(null);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);
  const [allocationMetaList, setAllocationMetaList] =
    useState<null | Array<AllocationMeta>>(null);

  async function onFirstBootRun() {
    try {
      console.log(`start up Allocation Component`);
      await hydrateAllocationMeta();
    } catch (e) {
      console.log(e);
    }
  }

  async function hydrateAllocationMeta() {
    const contract = ECSInstance.DirectDonationInstance;
    const mapPromises = Allocations.map((x) => {
      return (contract as DirectDonationInterface).getAllocationValue(
        x.walletAddress
      );
    });
    const promisesData = await Promise.all(mapPromises);
    const exportData = Allocations.map((x, i) => {
      return {
        walletAddress: x.walletAddress,
        percentValue: promisesData[i],
      };
    });
    setAllocationMetaList(exportData);
  }

  async function onPercentValueChange() {}

  async function onDeleteButtonClick() {}

  async function onCreateButtonClick() {
    //Dialog Widget call
  }

  useEffect(() => {
    if (firstBoot) {
      onFirstBootRun();
      setFirstBoot(false);
    }
  });
  return { allocationMetaList };
}

interface AllocationSettingProps {
  allocations: Array<AllocationMeta>;
  reloadAllocations: Function;
}

function AllocationSetting(props: AllocationSettingProps) {
  const [selectedIndex, setSelectedIndex] = useState("");
  const { allocationMetaList } = useComponentState(
    props.allocations,
    props.reloadAllocations
  );

  function ListView() {
    const handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: string
    ) => {
      setSelectedIndex(index);
    };

    function ItemGenerator() {
      const items = (allocationMetaList as Array<AllocationMeta>).map((x) => {
        return (
          <ListItemButton
            key={x.walletAddress}
            selected={selectedIndex === x.walletAddress}
            onClick={(event) => handleListItemClick(event, x.walletAddress)}
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
                label={`${(x.percentValue as number).toFixed(2)}%`}
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

    function UnallocatedPecentageCalculator() {
      if ((allocationMetaList as Array<AllocationMeta>).length !== 0) {
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

    if (allocationMetaList === null)
      return <Typography mb={"1em"}>loading!</Typography>;
    if (allocationMetaList.length === 0)
      return <Typography mb={"1em"}>Create An Allocation!</Typography>;
    return (
      <List
        component="nav"
        aria-label="main mailbox folders"
        sx={{ m: 1, maxHeight: 250, overflow: "auto" }}
      >
        {ItemGenerator()}
        {UnallocatedPecentageCalculator()}
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

function Item(props: AllocationMeta) {}

export default AllocationSetting;
