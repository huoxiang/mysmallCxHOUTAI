import mongoose from 'mongoose'
const Schema = mongoose.Schema
const head  = new Schema({
    
    openid:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    longitude:{
        type:Number,
        required:true
        //经度
    },
    latitude:{
        type:Number,
        required:true
        //纬度
    },
    status:{
        type:Number
    },
    city:{
        //团长的城市地址，具体只到市区
        type:String
    }

     
})
export default mongoose.model('head',head)