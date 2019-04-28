//商品的数据模型
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const foods = new Schema({
   foodsName:{
       type:String,
       require:true
   },
   foodsPrice:{
       type:Number,
       require
   },
   foodsdescribe:{
       type:String,
       require:true
   },
   foodsImgList:{
       //数组存放图片路径
       type:Array,
       require:true
   }
})
export default mongoose.model('foods',foods)