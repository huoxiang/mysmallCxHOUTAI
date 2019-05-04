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
   },
   foodsdescribe:{
       type:String,
       require:true
   },
   number:{
       type:Number,
       required:true
   },
   oldPrice:{
       type:Number
   },
   foodsImgList:{
       //数组存放图片路径
       type:Array,
       require:true
   },
   content:{
       type:String
   },
   couponSelected:{
       //分类ID
       type:Number
   },
   shelf:{
       type:Boolean,
       default:true
   }
})
export default mongoose.model('foods',foods)