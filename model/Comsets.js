import mongoose from 'mongoose'
const Schema = mongoose.Schema
const comsets = new Schema({
    Proportion:Number
    //为浮点小数
})
export default mongoose.model('comsets',comsets)