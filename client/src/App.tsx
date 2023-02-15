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
  const moveBy = async (direction: number, value: number) => {
    //direction = 0 --> throttle
      //value = -1.0 --> backward
      //value = 1.0 --> forward
    //direction = 1 --> turn
      //value = -1.0 --> turn left
      //value = 1.0 --> turn right
    //send command through ssh
    var obj = '{"throttle": ' + direction + ', "turn": ' + value + ',"powerDrive": false}';
    console.log("response gotten:", obj);

  };
  const listener = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      moveBy(0, 1.0);
    }
    if (e.key === "ArrowDown") {
      moveBy(0, -1.0);
    }
    if (e.key === "ArrowLeft") {
      moveBy(1, -1.0);
    }
    if (e.key === "ArrowRight") {
      moveBy(1, 1.0);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button
          variant="contained"
          onClick={async () => {
            await axios
              .get("https://d3-standby-server.vercel.app/testAPI/test", {
                params: { id: 1 },
              })
              .then((response) => setTestData(response.data));
            console.log("response gotten:", testData);
          }}
        >
          Test API
        </Button>
        <p>{testData}</p>
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
        <div>
          <Button
            variant="contained"
            onClick={async () => {
              //start listener thread through ssh
              window.addEventListener("keydown", listener);
            }}
          >
            Start Arrow Key navigation 
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            onClick={async () => {
              //stop both threads
              //enable robot kickstand
              window.removeEventListener("keydown", listener);

            }}
          >
            Stop Run
          </Button>
        </div>

      </header>
    </div>
  );
});
