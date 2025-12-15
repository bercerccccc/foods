let mongoose=require('mongoose')
let Schema=mongoose.Schema
let productSchema=new Schema({
    pinkod:String,
    tovarName:String,
    allergic:String,
    diabetic:String,
    sostav:String,
    ecologic:String,
    vredNature:String,

})
module.exports = mongoose.model('product', productSchema);