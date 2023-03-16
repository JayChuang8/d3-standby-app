const express = require("express");
const net = require("net");

const router = express.Router();
var socket;

router.post("/start", (request) => {
  console.log("Request ip is: ", request.body.ip);
  // Create a TCP socket and connect to the Python server
  socket = net.connect({ host: request.body.ip, port: 12345 }, () => {
    console.log("Connected to server");
  });
  socket.write(Buffer.from([0x00]));
});

router.post("/stop", () => {
  // Send a byte to the server
  socket.write(Buffer.from([0x05]));
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
