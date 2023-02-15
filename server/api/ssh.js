const express = require("express");
const { Client: SshClient } = require("ssh2");
const { Client: ScpClient } = require("node-scp");

const router = express.Router();

router.get("/stream", (request, response) => {
  const conn = new SshClient();
  conn
    .on("ready", () => {
      console.log("Client :: ready");

      conn.exec("ls -l", (err, stream) => {
        if (err) throw err;
        let output = "";
        stream
          .on("close", (code, signal) => {
            console.log(
              "Stream :: close :: code: " + code + ", signal: " + signal
            );
            conn.end();
            response.send(output);
          })
          .on("data", (data) => {
            console.log("STDOUT: " + data);
            output += data;
          })
          .stderr.on("data", (data) => {
            console.log("STDERR: " + data);
            output += data;
          });
      });
    })
    .connect({
      host: "double",
      username: request.query.ip,
      password: "15-003432!",
    });
});

router.post("/download", async (request, response) => {
  try {
    const conn = await ScpClient({
      host: "double",
      username: request.query.ip,
      password: "15-003432!",
    });
    await conn.downloadFile(
      "./readme.txt", // remote file location
      "../output/test.txt" // local file location
    );
    conn.close();
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
