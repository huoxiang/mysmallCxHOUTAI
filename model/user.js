import mongoose from 'mongoose'
const schema = mongoose.Schema
const UserSchma = new schema({
    //uusername不存入,改为将openid存入数据库，因为用户名字，会发生变化
   openid:{
       type:String,
       unique:true,
       require:true
   },
   phone:{
       //电话可以先为空,之后用户授权在将电话存入数据库
       type:String,
       require:true
   }
})
export default mongoose.model('User',UserSchma)