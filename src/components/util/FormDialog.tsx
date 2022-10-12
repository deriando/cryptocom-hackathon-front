import { createContext, useContext, useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export interface FormDialogProps {
  open: boolean;
  setOpen: Function;
  dialogTitle: string;
  dialogContent: string;
  textboxlabel: string;
  textboxType: string;
  actionButtonText: string;
  dialogCallback: Function;
}

export interface FromDialogReturn {
  returnType: "ClickedCancel" | "ClickedAction";
  dialogValue?: string;
}

export default function FormDialog(props: FormDialogProps) {
  const inputRef = useRef("");

  const onCancelButtonClick = () => {
    props.setOpen(false);
    props.dialogCallback({
      returnType: "ClickedCancel",
    });
  };

  const onActionButtonClick = () => {
    props.setOpen(false);
    props.dialogCallback({
      returnType: "ClickedAction",
      dialogValue: inputRef,
    });
  };

  return (
    <Dialog open={props.open} onClose={onCancelButtonClick}>
      <DialogTitle>{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.dialogContent}</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={props.textboxlabel}
          type={props.textboxType}
          fullWidth
          variant="standard"
          inputRef={inputRef}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelButtonClick}>Cancel</Button>
        <Button onClick={onActionButtonClick}>{props.actionButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}
