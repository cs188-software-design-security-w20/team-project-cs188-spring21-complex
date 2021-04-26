var express = require('express');
var router = express.Router();
const path = require('path');
var mysql = require('mysql');
var dbConn = require('../db.js');

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/register.html'));
});

router.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '../html/profile.html'));
});

module.exports = router;