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
  dialogTitle: string;
  dialogContent: string;
  textboxes: Array<Textbox>;
  actionButtonText: string;
  dialogCallback: Function;
}

export interface Textbox {
  label: string;
  type: string;
  value?: string;
}

export interface FormDialogReturn {
  returnType: "ClickedCancel" | "ClickedAction";
  dialogValue?: Array<Textbox>;
}

export default function FormDialog(props: FormDialogProps) {
  // const valueList : Array<Array<string>> = (props.textboxes === undefined)? [] : props.textboxes.map( x => [x.label, ""]);

  const stringArr = props.textboxes.map((x) => {
    return "";
  });
  // console.log(valueMap);
  const [value, setValue] = useState<Array<string>>(stringArr);

  const onCancelButtonClick = () => {
    props.dialogCallback({
      returnType: "ClickedCancel",
    });
  };

  const onActionButtonClick = () => {
    const returnValue = props.textboxes.map((x, i) => {
      x.value = value[i];
      return x;
    });

    props.dialogCallback({
      returnType: "ClickedAction",
      dialogValue: returnValue,
    });
  };

  function optionalTextField() {
    if (props.textboxes === undefined) return <></>;
    return props.textboxes.map((x, i) => {
      return (
        <TextField
          autoFocus
          key={x.label}
          margin="dense"
          label={x.label}
          type={x.type}
          fullWidth
          onChange={(reactObj) => {
            setValue((current) => {
              current[i] =
                reactObj.target.value === undefined
                  ? ""
                  : reactObj.target.value;
              return current;
            });
          }}
        />
      );
    });
  }

  return (
    <Dialog open={props.open} onClose={onCancelButtonClick}>
      <DialogTitle>{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.dialogContent}</DialogContentText>
        {optionalTextField()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelButtonClick}>Cancel</Button>
        <Button onClick={onActionButtonClick}>{props.actionButtonText}</Button>
      </DialogActions>
    </Dialog>
  );
}
