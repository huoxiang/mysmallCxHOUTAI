//订单表模型
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const order = new Schema({
    headId:{
        //下单时选择团长的id
        type:String
    },
    //下单了的订单表
    asId:{
        type:Number
    },
    openId:{
        type:String
    },
    time:{
        type:Number
    },
    orderId:{
        //订单Id,使用时间加订单号生成加一组随机数
        type:Number
    },
    money:{
        type:Number
    },
    shops:{
        //存放一次订单所有的商品，包括价格
        //下单是将用户一次购买的商品id和数量发给后端，后端计算价格，前端不实际做价格处理
        type:Array
    }
})
export default mongoose.model('order',order)