const express = require("express");
var cors = require("cors");
const { Client: SshClient } = require("ssh2");
const Client = require("ssh2-sftp-client");
const fs = require("fs");

const router = express.Router();
router.use(cors());

const USERNAME = "double";
const PASSWORD = "15-003432";

router.get("/stream", cors(), (request, response) => {
  const conn = new SshClient();
  conn
    .on("ready", () => {
      console.log("Client :: ready");

      // Gain superuser access
      conn.exec("sudo su", { pty: true }, (err, stream) => {
        if (err) throw err;

        stream
          .on("close", (code, signal) => {
            console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
            conn.end();
            response.end(); // end the response and terminate the request
          })
          .on("data", (data) => {
            console.log(`STDOUT: ${data}`);
            if (data.toString().includes("[sudo] password for double:")) {
              setTimeout(() => {
                stream.write(`${PASSWORD}\n`);
              }, 500);

              // Run bash script on robot which start listening on ports
              setTimeout(() => {
                stream.write("./SLAM.sh\n");
              }, 1000);

              // Exit sudo and ssh
              setTimeout(() => {
                stream.write("exit\n");
              }, 2000);
              setTimeout(() => {
                stream.write("exit\n");
              }, 2500);

              // Close ssh connection
              setTimeout(() => {
                response.write("Successfully started running server on robot");
                // conn.end();
                // response.end(); // end the response and terminate the request
              }, 3000);
            } else {
              response.write(data); // send the data as the response
            }
          })
          .stderr.on("data", (data) => {
            console.log(`STDERR: ${data}`);
            response.write(data); // send the error message as the response
          });
      });
    })
    .connect({
      host: request.query.ip,
      username: USERNAME,
      password: PASSWORD,
      sshConfig: {
        hostVerifier: () => {
          return true;
        },
      },
      hostHash: "sha256",
      readyTimeout: 99999,
      keepaliveInterval: 5000,
      keepaliveCountMax: 5,
      hostVerifier: () => true,
    });
});

router.post("/download", async (req, res) => {
  const remoteFilePath = "/media/60221859-7c21-4eab-8195-e7efd1523429/run.bag";
  const localFilePath = "C:/Users/jaych/OneDrive/Desktop/run.bag";

  const sftp = new Client();

  sftp
    .connect({
      host: req.body.ip,
      username: USERNAME,
      password: PASSWORD,
    })
    .then(() => {
      return sftp.get(remoteFilePath);
    })
    .then((data) => {
      fs.writeFileSync(localFilePath, data);
    })
    .then(() => {
      console.log("File downloaded successfully");
      res.status(200).send({ message: "File downloaded successfully" });
      sftp.end();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
      sftp.end();
    });
});

module.exports = router;
