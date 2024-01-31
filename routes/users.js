const mongoose = require("mongoose")
const plm = require("passport-local-mongoose")


mongoose.connect("mongodb://127.0.0.1:27017/RealTimeChat")
.then(function(a){
  console.log("Connected-DB")
});

var userSchema = mongoose.Schema({
  username: String,
  name: String,
  pic: String,
  email: String,
  password: String,
  about:String,
  friends: {
    type: Array,
    default: []
  }
})


userSchema.plugin(plm)


module.exports = mongoose.model("user",userSchema);