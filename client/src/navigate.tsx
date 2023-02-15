import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { observer } from "mobx-react-lite";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export const App = observer(() => {
  const [testData, setTestData] = useState([]);
  const [sshData, setSshData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  const moveTo = async (x: number, y: number) => {
  };

  const moveBy = async (deltaX: number, deltaY: number) => {

  };

  const listener = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      moveBy(0, -1);
    }
    if (e.key === "ArrowDown") {
      moveBy(0, 1);
    }
    if (e.key === "ArrowLeft") {
      moveBy(-1, 0);
    }
    if (e.key === "ArrowRight") {
      moveBy(1, 0);
    }
  };
  return (
    <div className="navigate">
      <header className="App-header">
        <div>
          <TextField
            label="IP Address of d3 Robot"
            variant="filled"
            sx={{
              input: {
                background: "white",
              },
            }}
            onChange={(o) => setIpAddress(o.target.value)}
          />
        </div>
        <div>
          <Button
            disabled={!ipAddress}
            variant="contained"
            onClick={async () => {
              await axios
                .get("https://d3-standby-server.vercel.app/ssh/stream", {
                  params: { ip: ipAddress },
                })
                .then((response) => setSshData(response.data));
              console.log("response gotten:", sshData);
            }}
          >
            Connect to d3 through SSH
          </Button>
        </div>
        <p>The ssh response is: {sshData}</p>
        <div>
          <Button
            variant="contained"
            onClick={async () => {
              await axios.post(
                "https://d3-standby-server.vercel.app/ssh/download",
                {
                  params: { ip: ipAddress },
                }
              );
            }}
          >
            Download file using SCP
          </Button>
        </div>
      </header>
    </div>
  );
});
