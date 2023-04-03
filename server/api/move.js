const express = require("express");
const net = require("net");
var cors = require("cors");

const router = express.Router();
router.use(cors());
var socket;

router.post("/start", (request, response) => {
  console.log("Request ip is: ", request.body.ip);
  // Create a TCP socket and connect to the Python server
  socket = net.connect({ host: request.body.ip, port: 12345 }, () => {
    console.log("Connected to server");
    response.send("Connected to server");
    response.end();
  });

  socket.on("error", (error) => {
    console.error("Socket connection error:", error);
    response.status(500).send("Socket connection failed");
    response.end();
  });

  socket.write(Buffer.from([0x00]));
});

router.post("/stop", (request, response) => {
  // Send a byte to the server
  socket.write(Buffer.from([0x05]));

  response.status(200).send({ message: "Stopped running successfully" });
  response.end();
});

router.post("/terminate", () => {
  // Send a byte to the server
  socket.write(Buffer.from([0x06]));
});

router.get("/", (request, response) => {
  console.log("The id is: ", request.query.id);

  // Send a byte to the server
  socket.write(Buffer.from([request.query.id]));

  // Handle any data received from the server
  socket.on("data", (data) => {
    console.log("Received data from server:", data);

    // Send response to API client and end the response stream
    response.end();
  });

  // Handle any errors that occur
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });

  // Handle the connection being closed
  socket.on("close", () => {
    console.log("Connection closed");
  });
});

module.exports = router;
