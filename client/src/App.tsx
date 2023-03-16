import { useState } from "react";
import logo from "./test.svg";
import "./App.css";
import { observer } from "mobx-react-lite";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const DEVELOPMENT = "http://localhost:9000";
const PRODUCTION = "https://d3-standby-server.vercel.app";
const HOST = PRODUCTION;

export const App = observer(() => {
  const [sshData, setSshData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");

  const listener = async (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      await axios.get(`${HOST}/move`, {
        params: { id: 0x01 },
      });
    }
    if (e.key === "ArrowDown") {
      await axios.get(`${HOST}/move`, {
        params: { id: 0x02 },
      });
    }
    if (e.key === "ArrowLeft") {
      await axios.get(`${HOST}/move`, {
        params: { id: 0x03 },
      });
    }
    if (e.key === "ArrowRight") {
      await axios.get(`${HOST}/move`, {
        params: { id: 0x04 },
      });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
                .get(`${HOST}/ssh/stream`, {
                  params: { ip: ipAddress },
                })
                .then((response) => setSshData(response.data));
              console.log("response gotten:", sshData);
            }}
          >
            Connect to d3 through SSH
          </Button>
        </div>
        <div>
          <Button
            color="secondary"
            variant="contained"
            onClick={async () => {
              //start listener thread through ssh
              window.addEventListener("keydown", listener);
              await axios.post(`${HOST}/move/start`, { ip: ipAddress });
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
              await axios.post(`${HOST}/move/stop`);
            }}
          >
            Stop Run
          </Button>
        </div>
        {/* <div>
          <Button
            color="secondary"
            variant="contained"
            onClick={async () => {
              await axios.post(`${HOST}/move/terminate`);
            }}
          >
            Terminate Script on Robot
          </Button>
        </div> */}
      </header>
    </div>
  );
});
