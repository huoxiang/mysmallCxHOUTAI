import mongoose from 'mongoose'
const Schema = mongoose.Schema
const comsets = new Schema({
    Proportion:Number
    //为个位数，根据这个个位数去设置佣金，管理系统直接设置为，一位的小数
})
export default mongoose.model('comsets',comsets)