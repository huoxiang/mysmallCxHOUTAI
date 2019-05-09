import mongoose from 'mongoose'
const schema = mongoose.Schema
const HTSchma = new schema({
   name:{
       type:String,
       unique:true,
       require:true
   },
   user:{
       type:String,
       require:true
   },
   password:{
    type:String,
    require:true
   }
})
export default mongoose.model('htuser',HTSchma)