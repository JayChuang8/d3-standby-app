const express = require("express");
const { Client: SshClient } = require("ssh2");
const { Client: ScpClient } = require("node-scp");

const router = express.Router();

const USERNAME = "double";
const PASSWORD = "15-003432";

router.get("/stream", (request, response) => {
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
              }, 1000);

              setTimeout(() => {
                stream.write("./SLAM.sh\n");
              }, 5000);

              // setTimeout(() => {
              //   stream.write(`${Buffer.from([3])}\n`);
              // }, 10000);

              // setTimeout(() => {
              //   stream.write("exit\n");
              // }, 10000);
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
    });
});

router.post("/download", async (request, response) => {
  try {
    const conn = await ScpClient({
      host: request.query.ip,
      username: USERNAME,
      password: PASSWORD,
    });
    await conn.downloadFile(
      "./readme.txt", // remote file location
      "../output/test.txt" // local file location
    );
    conn.close();
  } catch (e) {
    console.log(e);
  }

  const conn = new ScpClient();
  conn
    .connect({
      host: "my-server",
      username: "my-username",
      password: "my-password",
    })
    .then(() => {
      // Download the remote file to a local stream
      const stream = createReadStream("remote-file.txt");
      conn.get("/path/to/remote-file.txt", stream, (err) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.end("Internal Server Error");
        } else {
          res.writeHead(200, { "Content-Type": "application/octet-stream" });
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=remote-file.txt"
          );
          stream.pipe(res);
        }
        conn.close();
      });
    })
    .catch((err) => {
      console.error(err);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    });
});

module.exports = router;
