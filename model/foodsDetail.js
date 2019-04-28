import mongoose from 'mongoose'
const Schema = mongoose.Schema
const foodsDetail = new Schema({
    id:{
        type:Number
    },
    title:{
        type:String
    },
    smpileContent:{
        type:String
    },
    category:{
        type:Number
    }
})
export default mongoose.model('foodsDetail',foodsDetail)