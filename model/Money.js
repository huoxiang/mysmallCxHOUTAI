import mongoose from 'mongoose'
const Schema  = mongoose.Schema
const ouathMoney = new Schema({
  //团长的佣金数据,当团长审核通过时，才将团长信息存入】
   openid:{
     type:String,
     required:true 
   },
   money:{
       type:Number,
       required:true
   }
})
export default mongoose.model('ouathMoney',ouathMoney)