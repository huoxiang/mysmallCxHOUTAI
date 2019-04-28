//订单表模型
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const order = new Schema({
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
    }
})
export default mongoose.model('order',order)