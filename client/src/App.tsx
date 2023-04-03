import { useState } from "react";
import logo from "./test.svg";
import "./App.css";
import { observer } from "mobx-react-lite";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { RingLoader } from "react-spinners";
import { ModalDialog } from "./components/ModalDialog";
import { BackgroundParticles } from "./components/BackgroundParticles";

const DEVELOPMENT = "http://localhost:9000";
// const PRODUCTION = "https://d3-standby-server.vercel.app";
const HOST = DEVELOPMENT;

export const App = observer(() => {
  const [isConnected, setIsConnected] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [kickstandActivated, setKickstandActivated] = useState(false);

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
      <BackgroundParticles />
      <header
        className="App-header"
        style={{
          backgroundImage: kickstandActivated
            ? "linear-gradient(to bottom, #144f06, #80d57c)"
            : "linear-gradient(to bottom, #040226, #7c91d5)",
        }}
      >
        {isLoading && <RingLoader color={"#000000"} loading={isLoading} />}
        {!isLoading && (
          <>
            <ModalDialog open={openModal} isConnected={isConnected} />
            <img src={logo} className="App-logo" alt="logo" />
            {!isConnected && (
              <>
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
                      setIsLoading(true);
                      await axios
                        .get(`${HOST}/ssh/stream`, {
                          params: { ip: ipAddress },
                        })
                        .then(() => {
                          setIsConnected(true);
                        })
                        .catch(() => {
                          setIsConnected(false);
                        });
                      setIsLoading(false);
                      setOpenModal(true);
                    }}
                  >
                    Connect to d3 robot
                  </Button>
                </div>
              </>
            )}
            {isConnected && (
              <>
                <div>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={async () => {
                      //start listener thread through ssh
                      window.addEventListener("keydown", listener);
                      setIsLoading(true);
                      await axios
                        .post(`${HOST}/move/start`, { ip: ipAddress })
                        .then(() => {
                          setKickstandActivated(true);
                        })
                        .catch(() => {
                          setKickstandActivated(false);
                        });
                      setIsLoading(false);
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
                      await axios.post(`${HOST}/move/stop`).then(() => {
                        setKickstandActivated(false);
                      });
                    }}
                  >
                    Stop Run
                  </Button>
                </div>
                <div>
                  <Button
                    disabled={!ipAddress}
                    color="primary"
                    variant="contained"
                    onClick={async () => {
                      setIsLoading(true);
                      await axios
                        .post(`${HOST}/ssh/download`, {
                          ip: ipAddress,
                        })
                        .then(() => {
                          setIsLoading(false);
                          setIsConnected(false);
                        })
                        .catch(() => {
                          setIsConnected(false);
                          setIsLoading(false);
                        });
                    }}
                  >
                    Download run bag file
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </header>
    </div>
  );
});
