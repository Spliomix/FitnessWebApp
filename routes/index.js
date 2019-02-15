var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var textdb = require('../models/text');
var planDb = require('../models/plan');
var url = require('url');
router.use(passport.session())
var actURL;

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('shop/index');
});

var mongoose = require('mongoose');
var uri = process.env.DBURL;

mongoose.connect(uri, { useMongoClient: true });






//redirect to the create plan site
router.get('/createPlan', function (req, res) {
    res.render('shop/fitnessplanCreation');
});



//saves the Plan to the DB
router.post('/newPlan', function (req, res) {
    console.log(req.body);//body returns the JSON
    var data = new planDb(req.body);//need a validation
    data.save();
    res.render('shop/fitnessplanCreation');//need a response
});


module.exports = router;