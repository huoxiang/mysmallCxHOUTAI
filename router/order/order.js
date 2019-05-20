import Router from 'koa-router'
import order from '../../model/order'
import cart from '../../model/cart'
const router = new Router({
    prefix:'/order'
})
router.get('/cs',async ctx=>{
    ctx.body = {
        code:0
    }
})
router.post('/pay',async ctx=>{
    //支付接口
    //支付成功后将订单状态更改
    //传入订单号，和订单状态
    const { payStatus,orderNo} = ctx.query
    let findOrder = await order.findOne({
        orderId:orderNo
    })
    if(payStatus ==2){
        //支付成功
        let res = await order.findByIdAndUpdate(findOrder._id,{$set:{
             orderStatus:2
        }})
         ctx.body={
             code:0,
             msg:'支付成功'
         }
    }else{
        ctx.body = {
            code:-1,
            msg:'支付失败,请重新支付'
        }
    }
})
router.post('/createOrder',async ctx=>{
    //传入用户openid,团长openid
    const {openid,paylist,headerid} = ctx.request.body
    let oldCart = await cart.findOne({
        openid
    })
    let newARR=[]//用来存放在购物车中找到的
    for(let i=0;i<paylist.length;i++){
      oldCart.foodsList.map((item,index)=>{
        if(item.foodsid==paylist[i]){
                   newARR.push(item)
                   //取出购物车中相等购物车
         }
      })
    }
    //获得传入id的商品
    //需要生成一个订单id，并存储订单信息
    if(newARR.length>0){
          //选取了购物车的数据
          let sum=0
          //设置价格
          newARR.map((item,index)=>{
              sum+=item.foodsPrice*item.count
          })
         console.log(sum)
         let createOrder = await order.create({
            headId:headerid,
            time:new Date().getTime(),
            orideId:new Date().getTime()+1,
            openid,
            money:sum,
            orderStatus:0,
            shops:newARR
            
         })
         ctx.body = {
             code:0,
             msg:`需支付金额${sum}元`,
             money:sum
         }
    }
    else{
        ctx.body = {
            code:0,
            msg:'请添加商品'
        }
    }
})
export default router