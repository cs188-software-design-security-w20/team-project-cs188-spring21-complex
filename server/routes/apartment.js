var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConn = require('../db.js');

// url/apartment
router.get('/', function (req, res) {
	dbConn.getConnection((err, db) => {
    if (err) {
      console.log('connection failed', err);
			res.send(err);
			return;
    }
    console.log('connection success');
		db.query(`SELECT * from test.apts`, (err, rows) => {
			if (err) {
				res.send("ERROR");
			} else {
				res.send(rows);
			}
		});
		db.release(); // remember to release the connection when you're done
	})
  // res.send('success');
})

// url/apartment/{id}
router.get('/:id', function (req, res) {
  res.send('success');
})

module.exports = router;