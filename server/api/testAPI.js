var express = require('express');
var router = express.Router();

router.get('/', (request, result, next) => {
    result.send('API is working properly here');
});

module.exports = router;