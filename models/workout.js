let mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

  let exercise = {//construct
   reps:[]   
  }

let workoutSchema = new Schema({
    plan: {type: String, required: true},
    userId: {type: String, required: true},
    exercises: {type: [], required: false},
    date: {type: String, required:true},//YYYY-MM-DD
});

module.exports = mongoose.model('workout', workoutSchema);