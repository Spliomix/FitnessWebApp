var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var textdb = require('../models/text');
var planDb = require('../models/plan');
var workoutDb = require('../models/workout');
var url = require('url');
router.use(passport.session())
var actURL;



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

let actDateOwn = ()=>{//YYYYMMDD
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()>=11?date.getMonth()+1:'0'+(date.getMonth()+1).toString();
  let day = date.getDate()>=10?date.getDate():'0'+(date.getMonth()).toString();   
  return year.toString()+month+day;
}



//render the typical workout mask with the corresponding plan
router.get('/startWorkout', function(req, res){

  if(!req.isAuthenticated()){
console.log("hombrine");
           res.render('shop/index');
     }else{
       let planId = req.user.activePlan;
    planDb.find({_id:planId},  function (err, plan) {
      planDb.find({_id:planId},  function (err, workout) {
          if(plan)
            res.render('shop/workout', {plan: plan[0], workout:workout});
          else
            res.render('shop/workout');
        });  
    });  
}
  
});



//save the workout
router.post('/saveWorkout', function(req, res){

  let saveDate = actDateOwn();//YYYYMMDD
  
  let userId = req.user.id;
  let planId = req.user.activePlan;
  
  let workout = [];//values from the exercises
  let weights = req.body;
  let weightPointer = 0 ;
  
    planDb.find({_id:planId},  function (err, plan) {
      //calc the order of the weights
      for(let i = 0; i<plan[0].exercises.length; ++i){
        let exercises = [];
            for(let j = 0; j<plan[0].exercises[i].reps.length; ++j){
              exercises.push(weights[weightPointer++]);
            } 
        workout.push(exercises);
        }
       
  let dataIn = {
    plan: planId,
    userId: userId,
    exercises: workout, 
    date: saveDate,
  }
  console.log(dataIn);
    let data = new workoutDb(dataIn);//need a validation
    data.save();
      
      res.sendStatus(200);
    });  
  
 
  
});

module.exports = router;