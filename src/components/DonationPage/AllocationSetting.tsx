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
import FormDialog, {
  FormDialogReturn,
  FormDialogProps,
  Textbox,
} from "../util/FormDialog";

export interface AllocationMeta {
  walletAddress: string;
  percentValue?: number;
}

function useComponentState() {
  const ECSInstance = EventControllerSingleton.getInstance();
  let allocationList: Array<AllocationMeta> = [];
  const [trigger, setTrigger] = useState<boolean>(false);
  const [firstBoot, setFirstBoot] = useState<boolean>(true);
  const [allocationMetaList, setAllocationMetaList] =
    useState<null | Array<AllocationMeta>>(null);

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
      await generateAllocationList();
    } catch (e) {
      console.log(e);
    }
  }

  async function generateAllocationList() {
    const allocationsTemplate = await getAllocationList();
    const allocationsData = await hydrateAllocationMeta(allocationsTemplate);
    setAllocationMetaList(allocationsData);
  }

  async function getAllocationList() {
    const contract: DirectDonationInterface =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    const data = await contract.getWalletList();
    const exportData = data.map((x) => {
      return { walletAddress: x };
    });
    return exportData;
  }

  async function hydrateAllocationMeta(allocationList: Array<AllocationMeta>) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    const mapPromises = allocationList.map((x) => {
      return contract.getAllocationValue(x.walletAddress);
    });
    const promisesData = await Promise.all(mapPromises);
    const exportData = allocationList.map((x, i) => {
      return {
        walletAddress: x.walletAddress,
        percentValue: promisesData[i],
      };
    });
    return exportData;
  }

  //User Actions
  async function onPercentValueChange(walletAddress: string, percent: number) {
    try {
      await modifyAllocation(walletAddress, percent);
    } catch (e) {
      console.log(e);
    }
  }

  async function modifyAllocation(walletAddress: string, percent: number) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    const currentValue = await contract.getAllocationValue(walletAddress);

    if (percent < 0 || percent > 100) return;
    if (percent < currentValue) {
      await contract.substractAllocation(
        walletAddress,
        currentValue - percent,
        modifyAllocationCallback
      );
    }
    if (percent > currentValue) {
      await contract.addAllocation(
        walletAddress,
        percent - currentValue,
        modifyAllocationCallback
      );
    }
  }

  function modifyAllocationCallback(data: any) {
    //data not used
    console.log(data);
    generateAllocationList();
  }

  //User Actions
  async function onDeleteButtonClick(walletAddress: string) {
    try {
      await removeAllocation(walletAddress);
    } catch (e) {
      console.log(e);
    }
  }

  async function removeAllocation(walletAddress: string) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    await contract.removeAllocation(walletAddress, removeAllocationCallback);
  }

  async function removeAllocationCallback(data: any) {
    // data not used
    generateAllocationList();
  }

  //User Actions
  async function onCreateButtonClick() {
    //Dialog Widget call
    setDialog((x) => {
      x.open = true;
      (x.dialogTitle = "Create An Allocation"),
        (x.dialogContent = "Enter Your Wallet Address to set an Allocation."),
        (x.actionButtonText = "Create"),
        (x.dialogCallback = onDialogCallback);
      x.textboxes = [
        {
          label: "Wallet Address",
          type: "",
        },
        {
          label: "Percentage",
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
          const walletAddress: string = (
            dataForm.dialogValue as Array<Textbox>
          )[0].value as string;
          const percent: number = Number(
            (dataForm.dialogValue as Array<Textbox>)[1].value
          );
          await createAllocation(walletAddress, percent);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  async function createAllocation(walletAddress: string, percent: number) {
    const contract =
      ECSInstance.DirectDonationInstance as DirectDonationInterface;
    await contract.createAllocation(
      walletAddress,
      percent,
      createAllocationCallback
    );
  }

  async function createAllocationCallback(data: any) {
    //data not used
    await generateAllocationList();
  }

  useEffect(() => {
    if (firstBoot) {
      onFirstBootRun();
      setFirstBoot(false);
    }
  });
  return {
    allocationMetaList,
    dialog,
    onCreateButtonClick,
    onDeleteButtonClick,
    onPercentValueChange,
  };
}

function AllocationSetting() {
  const [selectedIndex, setSelectedIndex] = useState("");
  const {
    allocationMetaList,
    dialog,
    onCreateButtonClick,
    onDeleteButtonClick,
    onPercentValueChange,
  } = useComponentState();

  function ListView() {
    const handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      index: string
    ) => {
      setSelectedIndex(selectedIndex === index ? "" : index);
    };

    const handleListItemKey = (
      event: React.KeyboardEvent<HTMLDivElement>,
      walletAddress: string,
      percent: string
    ) => {
      const percentNum = Number(percent);
      onPercentValueChange(walletAddress, percentNum);
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
              align-items={"center"}
              width={"100%"}
            >
              <ListItemText
                primary={"wallet contract"}
                secondary={String(x.walletAddress)}
              />
              <TextField
                id="outlined-basic"
                label={`${(x.percentValue as number).toFixed(2)}%`}
                variant="outlined"
                size="small"
                type="number"
                InputProps={{
                  inputProps: {
                    max: 100,
                    min: 10,
                    step: 0.01,
                  },
                }}
                sx={{ width: 100, ml: 1 }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    //@ts-ignore
                    handleListItemKey(
                      event,
                      x.walletAddress,
                      event.target.value
                    );
                  }
                }}
              />
            </Box>
          </ListItemButton>
        );
      });

      return items;
    }

    function UnallocatedPecentageCalculator() {
      if ((allocationMetaList as Array<AllocationMeta>).length !== 0) {
        const sum = (allocationMetaList as Array<AllocationMeta>)
          .map((x) => {
            return x.percentValue === undefined ? 0 : x.percentValue;
          })
          .reduce((x, y) => {
            return x + y;
          });

        return (
          <>
            <Divider></Divider>

            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
              {`Currrent Unallocated Percent: ${100 - sum}%`}
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
    <>
      <FormDialog
        open={dialog.open}
        dialogTitle={dialog.dialogTitle}
        dialogContent={dialog.dialogContent}
        textboxes={dialog.textboxes}
        actionButtonText={dialog.actionButtonText}
        dialogCallback={dialog.dialogCallback}
      ></FormDialog>
      <Card sx={{ p: 1, m: 1 }}>
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
              <Button
                disabled={selectedIndex === ""}
                onClick={() => {
                  onDeleteButtonClick(selectedIndex);
                }}
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

// function Item(props: AllocationMeta) {}

export default AllocationSetting;
