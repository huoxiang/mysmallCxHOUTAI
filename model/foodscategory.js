//商品分类暂时不使用
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const foodsCategory = new Schema({
   //分类ID
   cateGoryId:{
       type:Number
   },
   cateGoryName:{
       type:String
   },
   selectId:{
       //排列Id
       type:Number
   }
})
export default mongoose.model('foodsCategory',foodsCategory)