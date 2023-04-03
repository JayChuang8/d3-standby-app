import { useState } from "react";
import { observer } from "mobx-react-lite";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

type ModalDialogProps = {
  open: boolean;
  isConnected: boolean;
};

export const ModalDialog = observer(
  ({ open, isConnected }: ModalDialogProps) => {
    const [openModal, setOpenModal] = useState(open);

    return (
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1.5,
            borderRadius: "10px",
          }}
        >
          <Alert severity={isConnected ? "success" : "error"}>
            <AlertTitle>{isConnected ? "Success" : "Error"}</AlertTitle>
            {isConnected
              ? "Successfully connected to the robot, press the start run button to begin the ROS pipeline!"
              : "There was an error trying to connect to the d3 robot, make sure the correct IP address is entered and the robot is on!"}
          </Alert>
          <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
            <Button
              color={isConnected ? "success" : "error"}
              variant="contained"
              onClick={() => setOpenModal(false)}
            >
              {isConnected ? "Ok" : "Close"}
            </Button>
          </div>
        </Box>
      </Modal>
    );
  }
);
