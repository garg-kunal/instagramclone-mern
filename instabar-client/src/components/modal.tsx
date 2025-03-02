import { FC, ReactNode } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import getIcon from "../icons";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  display: "flex",
  flexDirection: "column",
  borderRadius: 2,
};

type Props = {
  title: string; // Add title prop
  isOpen: boolean;
  handleClose: () => void;
  primaryButtonAction: (e: any) => void;
  primaryButtonLabel: string;
  secondaryButtonAction?: () => void;
  secondaryButtonLabel?: string;
  children?: ReactNode; // Add children prop
  disabledAllActions?: boolean;
};

const CustomModal: FC<Props> = (props: Props) => {
  return (
    <Modal
      open={props.isOpen}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="flex flex-row p-4 justify-between border-b pb-2">
          <div className="text-lg font-medium">{props.title}</div>
          <Button className="cursor-pointer" onClick={props.handleClose}>
            {getIcon("CANCEL")}
          </Button>
        </div>
        <div className="p-4">{props.children}</div>
        <div className="flex flex-row p-4 border-t justify-end">
          {props.secondaryButtonLabel && (
            <Button
              variant="outlined"
              onClick={props.secondaryButtonAction}
              disabled={props.disabledAllActions}
            >
              {props.secondaryButtonLabel}
            </Button>
          )}
          {props.primaryButtonAction && (
            <Button
              variant="contained"
              onClick={props.primaryButtonAction}
              disabled={props.disabledAllActions}
              sx={{ backgroundColor: "black" }}
            >
              {props.primaryButtonLabel}
            </Button>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default CustomModal;
