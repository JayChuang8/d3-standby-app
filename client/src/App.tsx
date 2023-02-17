import { useState } from "react";
import logo from "./test.svg";
import "./App.css";
import { observer } from "mobx-react-lite";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { truncate } from "fs";

const DEVELOPMENT = "http://localhost:9000";
const PRODUCTION = "https://d3-standby-server.vercel.app";

export const App = observer(() => {
  const [testData, setTestData] = useState([]);
  const [sshData, setSshData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");

  const listener = async (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      await axios.get(`${PRODUCTION}/move`, {
        params: { id: 0x01 },
      });
    }
    if (e.key === "ArrowDown") {
      await axios.get(`${PRODUCTION}/move`, {
        params: { id: 0x02 },
      });
    }
    if (e.key === "ArrowLeft") {
      await axios.get(`${PRODUCTION}/move`, {
        params: { id: 0x03 },
      });
    }
    if (e.key === "ArrowRight") {
      await axios.get(`${PRODUCTION}/move`, {
        params: { id: 0x04 },
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {/* <Button
          color="secondary"
          variant="contained"
          onClick={async () => {
            await axios
              .get(`${DEVELOPMENT}/testAPI/test`, {
                params: { id: 1 },
              })
              .then((response) => setTestData(response.data));
            console.log("response gotten:", testData);
          }}
        >
          Test API
        </Button> */}
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
            color="secondary"
            variant="contained"
            onClick={async () => {
              await axios
                .get(`${PRODUCTION}/ssh/stream`, {
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
        {/* <div>
          <Button
            color="secondary"
            variant="contained"
            onClick={async () => {
              await axios.post(`${DEVELOPMENT}/ssh/download`, {
                params: { ip: ipAddress },
              });
            }}
          >
            Download file using SCP
          </Button>
        </div> */}
        <div>
          <Button
            color="secondary"
            variant="contained"
            onClick={async () => {
              //start listener thread through ssh
              window.addEventListener("keydown", listener);
              await axios.post(`${PRODUCTION}/move/start`, { ip: ipAddress });
            }}
          >
            Start Run
          </Button>
        </div>
        <div>
          <Button
            color="secondary"
            variant="contained"
            onClick={async () => {
              //stop both threads
              //enable robot kickstand
              window.removeEventListener("keydown", listener);
              await axios.post(`${PRODUCTION}/move/stop`);
            }}
          >
            Stop Run
          </Button>
        </div>
      </header>
    </div>
  );
});
