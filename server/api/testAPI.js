var express = require("express");
var router = express.Router();

router.get("/test", (request, result) => {
  console.log("The params are", request.params);
  result.send(
    `API is working properly here with query param of ${request.query.id}`
  );
});

module.exports = router;
