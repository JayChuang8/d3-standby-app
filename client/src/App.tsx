import { useState } from "react";
import logo from "./test.svg";
import "./App.css";
import { observer } from "mobx-react-lite";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { truncate } from "fs";

export const App = observer(() => {
  const [testData, setTestData] = useState([]);
  const [sshData, setSshData] = useState([]);
  const [ipAddress, setIpAddress] = useState("");
  // const moveBy = async (direction: number, value: number) => {
  //   //direction = 0 --> throttle
  //     //value = -1.0 --> backward
  //     //value = 1.0 --> forward
  //   //direction = 1 --> turn
  //     //value = -1.0 --> turn left
  //     //value = 1.0 --> turn right
  //   //send command through ssh
  //   var obj = '{"throttle": ' + direction + ', "turn": ' + value + ',"powerDrive": false}';
  //   console.log("response gotten:", obj);
  // };
  const moveBy = async (direction: number) => {
  // 0= start
  // 1= forward
  // 2= backward
  // 3= left trun
  // 4= right turn
  // 5= stop
    var obj = ''+direction;
    console.log("response gotten:", obj);
  };
  const listener = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      moveBy(1);
    }
    if (e.key === "ArrowDown") {
      moveBy(2);
    }
    if (e.key === "ArrowLeft") {
      moveBy(3);
    }
    if (e.key === "ArrowRight") {
      moveBy(4);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button
          color="secondary"
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
            // disabled={!ipAddress}
            color="secondary"
            variant="contained"
            onClick={async () => {
              // await axios
              //   .get("https://d3-standby-server.vercel.app/ssh/stream", {
              //     params: { ip: ipAddress },
              //   })
              //   .then((response) => setSshData(response.data));
              // console.log("response gotten:", sshData);
              window.addEventListener("keydown", listener);
              moveBy(0);
            }}
          >
            Connect to d3 through SSH
          </Button>
        </div>
        <p>The ssh response is: {sshData}</p>
        <div>
          <Button
            color="secondary"
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
        {/* <div>
          <Button
            variant="contained"
            onClick={async () => {
              //start listener thread through ssh
              window.addEventListener("keydown", listener);
            }}
          >
            Start Arrow Key navigation 
          </Button>
        </div> */}
        <div>
          <Button
            color="secondary"
            variant="contained"
            onClick={async () => {
              //stop both threads
              //enable robot kickstand
              window.removeEventListener("keydown", listener);
              moveBy(5);
            }}
          >
            Stop Run
          </Button>
        </div>

      </header>
    </div>
  );
});
