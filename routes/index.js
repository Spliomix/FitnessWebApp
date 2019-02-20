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
//if the user used made this workout on the same day, the values we be loaded
router.get('/startWorkout', function (req, res) {
    if (!req.isAuthenticated()) {
        res.render('shop/index');
    } else {
        let planId = req.user.activePlan;
        planDb.findOne({ _id: planId }, function (err, plan) {
            if (plan) {
                planDb.findOne({ date: actDateOwn }, function (err, workout) {
                    console.log(workout);
                    if (workout) {
                        res.render('shop/workout', { plan: plan, workout: workout });
                    }
                    else {
                        res.render('shop/workout', { plan: plan });
                    }
                });
            } else {
                res.render('shop/workout');
            }
        });
    }
});



//save the workout
router.post('/saveWorkout', function (req, res) {
    let saveDate = actDateOwn();//YYYYMMDD
    let userId = req.user.id;
    let planId = req.user.activePlan;
  
  //dont know if i need the finding thing, i could only delete it annd do the things in the delete callback
    workoutDb.findOne({ userId: req.user.id, plan: planId, date: actDateOwn() }, function (err, workoutData) {
        if(workoutData){
          console.log("delete the following Id: " +workoutData._id);
          workoutDb.findByIdAndRemove(new mongoose.mongo.ObjectID(workoutData._id), function (err,offer){
              if(err) { throw err; }
            console.log(offer);
          }); 
        }
        let workout = [];//values from the exercises
        let weights = req.body;
        let weightPointer = 0;

        planDb.find({ _id: planId }, function (err, plan) {
            //calc the order of the weights
            for (let i = 0; i < plan[0].exercises.length; ++i) {
                let exercises = [];
                for (let j = 0; j < plan[0].exercises[i].reps.length; ++j) {
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
            let data = new workoutDb(dataIn);//need a validation
            data.save();
            res.sendStatus(200);
        });
    });
});



//load the predefined values
router.post('/loadPreValues', (req, res, next ) => {
      if (!req.isAuthenticated()) {
        res.render('shop/index');
    } else {
        let planId = req.user.activePlan;
        workoutDb.findOne({ userId: req.user.id, plan: planId, date: actDateOwn() }, function (err, workout) {
          console.log(workout);
          let data=[];
          for(let i = 0; i<workout.exercises.length;++i){
            for(let j = 0; j<workout.exercises[i].reps.length;j++){
             data.push( workout.exercises[i].reps[j]);
            }
          }
          console.log(data);
          res.json(data);
        });
    }
});

module.exports = router;