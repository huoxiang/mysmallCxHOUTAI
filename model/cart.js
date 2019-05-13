import mongoose from 'mongoose'
const Schema = mongoose.Schema
const cart = new Schema({
   //openid
   openid:{
       type:String,
       required:true
   },
   foodsList:{
       type:Array,
       required:true
       //为数组里面存放json
   },
//    cartsId:{
//        //购物车的id,用户在购物车点击下单之后，订单到order表,再直接删除购物车
//        type:Number
//    },
   createTime:{
       type:String
   }  
})
export default mongoose.model('cart',cart)