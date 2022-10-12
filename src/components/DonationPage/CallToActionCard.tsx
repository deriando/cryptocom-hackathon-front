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

interface CallToActionCard {
  contractAddress: string;
}

function CallToActionCard(props: CallToActionCard) {
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

export default CallToActionCard;
