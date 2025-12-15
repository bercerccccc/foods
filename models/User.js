let mongoose=require('mongoose')
let Schema=mongoose.Schema
let userSchema=new Schema({
    email:String,
    name:String,
    pass:String
})
module.exports = mongoose.model('user', userSchema);