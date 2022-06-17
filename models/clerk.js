import mongoose from 'mongoose'
const Schema = mongoose.Schema
import uniqueValidator from 'mongoose-unique-validator';
// import arrayValidator from 'mongoose-array-validator';
const clerkSchame = new Schema({
type :{type: String, required: true},
name :{type :String , required : true},
staffNum : {type :String , required : true , unique :true},
password :{type :String , required : true  ,minlength :6},

})

// clerkSchame.plugin(arrayValidator);
clerkSchame.plugin(uniqueValidator);
const Clerk= mongoose.model('Clerk' , clerkSchame)
export default Clerk