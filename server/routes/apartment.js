var express = require('express');
var router = express.Router();

// url/apartment
router.get('/', function (req, res) {
  res.send('success');
})

// url/apartment/{id}
router.get('/:id', function (req, res) {
  res.send('success');
})

module.exports = router;