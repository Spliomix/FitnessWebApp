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
/*router.get('/', function (req, res, next) {
    res.render('shop/index');
});*/

var mongoose = require('mongoose');
var uri = process.env.DBURL;

mongoose.connect(uri, { useMongoClient: true });//to avoid the depricated warning






//redirect to the create plan site
router.get('/createPlan', function (req, res) {
    res.render('shop/fitnessplanCreation');
});



//saves the Plan to the DB
router.post('/newPlan', function (req, res) {
    console.log(req.body);//body returns the JSON
  if(req.body.name ===''){              
      return res.status(400).send({
       message: 'Plan is not correct'
    });
  }

    let data = new planDb(req.body);//need a validation
    data.save();
    res.render('shop/fitnessplanCreation');//need a response
});


//read the plan from the DB
router.get('/', function(req, res) { 
    planDb.find({},'name',  function (err, plans) {
      res.render('shop/index', {messages: plans});
    });                
});

router.get('/*/style.css', function(req, res) { 
  res.sendFile('../public/style.css');               
});


//show the selected plan
router.get('/plan/:name', function(req, res) {

    var name = req.params.name;
    console.log("planname: "+ name);
    planDb.find({name:name},  function (err, plan) {
      console.log(plan[0]);
      res.render('shop/planView', {plan: plan[0]});
    });  
});

router.get('/startWorkout', function(req, res){
  res.render('shop/workout');
});

module.exports = router;