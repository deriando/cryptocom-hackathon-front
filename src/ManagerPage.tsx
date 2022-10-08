import { createContext, useContext, useState } from "react";
import { Box, Button, Card, CardHeader, Typography } from "@mui/material";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import EventControllerSingleton from "./logic/EventController";

function ManagerCreationCard() {
  async function createManager() {}

  return (
    <Card sx={{ padding: "1em" }}>
      <Typography mb={"1em"}>This is the Manager Page!</Typography>
      <Button variant="outlined" onClick={createManager}>
        <Typography>Placeholder</Typography>
      </Button>
    </Card>
  );
}

function ManagerPage() {
  let card: any;
  // @ts-ignore

  function logic() {
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
