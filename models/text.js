var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {type: String, required: true},
    text: {type: String, required: true},
    website: {type: String, required: true}
  //position of the window x,y?
  //date?
  //public (t/f)
  //color?
  //title?
  //hidden?
});

module.exports = mongoose.model('textdb', userSchema);