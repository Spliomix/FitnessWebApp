let mongoose = require('mongoose');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

  let exercise = {//construct
   name:"",
   reps:[],
   notiz:"",    
  }

let planSchema = new Schema({
    //user: {type: String, required: false},
    name: {type: String, required: true},
    type: {type: String, required: true},
    exercises: {type: [exercise], required: true},
});

module.exports = mongoose.model('planDb', planSchema);