import Router from 'koa-router'
import order from '../../model/order'
import cart from '../../model/cart'
const router = new Router({
    prefix:'/order'
})
router.get('/headerOrder',async ctx=>{
    const {headId} = ctx.query
    console.log(headId) 
    //需要获得当前的时间
    //时间计算到当前时间的凌晨0点
    //减去两天的时间戳
    //为一次团购的时间
    let time = new Date()
    let year = time.getFullYear()
    let Month=time.getMonth()
    let day=time.getDate()
    let atime = new Date(`${year}-${Month+1}-${day} 00:00:00`)
    let dayTime =1000*60*60*24*2
    let tdtime = atime.getTime()
    atime = atime - dayTime
    //当前的时间戳
    console.log(atime,'两天前')
    console.log(tdtime,'今天')
    let res = await order.find({
        headId,
        time:{
            $lte:tdtime,
            $gte:atime
        }
    })
    //查询到团长这次的团购下单的订单
    if(res.length>0){
       ctx.body={
           code:0,
           msg:'请求成功',
           data:res
       }
    }else{
        ctx.body={
            code:-1,
            msg:'没有订单'
        }
    }
})
router.get('/getUserOrder',async ctx=>{
    const {openid,status} = ctx.query;
    //根据状态返回相应的数据
    let res =await order.find({
       openId:openid,orderStatus:status
    });
    ctx.body = {
        code:0,
        data:res,
        msg:'获取订单成功'
    }
});
router.post('/deleteOrder',async ctx=>{
    const {openid,orderNo} = ctx.request.body
    let res =await order.findOneAndRemove({
        openId:openid,orderId:orderNo
    })
    if(res){
        ctx.body = {
            code:0,
            msg:'删除用户订单成功'
        }
    }else{
        ctx.body = {
            code:-1,
            msg:'删除用户订单失败'
        }
    }
})
router.post('/pay',async ctx=>{
    //支付接口
    //支付成功后将订单状态更改
    //传入订单号，和支付状态
    const { payStatus,orderNo} = ctx.query
    let findOrder = await order.findOne({
        orderId:orderNo
    });
    if(payStatus ==2){
        //支付成功
        let res = await order.findByIdAndUpdate(findOrder._id,{$set:{
             orderStatus:2
        }});
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
});
router.get('/getDateSelect',async ctx=>{
    //此接口返回一段时间内，团长的订单,如五月返回五月所有的订单
   //需要传入参数 月份，团长id
   //进入接口先获得月份
   const {Month,headId} = ctx.query
   let year = new Date().getFullYear()
   //此处还需进行判断，这个月份是否有30天
   let day = 30
   if(Month==5 || Month==1 || Month==7 || Month==8 || Month==1 || Month==10 || Month==12 ){
        day=31
   }
   console.log(day,'当前月份天数')
   let date1 = new Date(`${year}-${Month}-01 23:59:59`)//获取每个月的第一天
   let date2 = new Date(`${year}-${Month}-${day} 23:59:59`)
   let time1 = date1.getTime()
   let time2 = date2.getTime() //转换时间戳
   let res = await  order.find({
       headId:headId,
       time:{
           $lte:time2,
           $gte:time1
       }
   })
   console.log(res)
   if(res.length>0){
       ctx.body={
           code:0,
           data:res
       }
   }else
   {
       ctx.body={
           code:-1,
           msg:"当前并未存在数据",
           data:[]
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
    let carts= []
    console.log(oldCart.foodsList,'做对比的数据')
    for(let i=0;i<paylist.length;i++){
      oldCart.foodsList.map((item,index)=>{
        if(item.foodsid==paylist[i]) {
            newARR.push(item)
            //取出购物车中相等购物车
        }else
        {
            carts.push(item)
        }
      })
    }
    if(carts.length==oldCart.foodsList.length){
        carts=[]
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
            orderId:new Date().getTime()+1,
            openId:openid,
            money:sum,
            orderStatus:0,
            shops:newARR
         })
         if(createOrder){
             // 创建成功后，需要删除用户购物车中的数据
             // 从oldCart中删除数据并保存
             if(carts.length>0){
                 console.log(carts,'未提交的商品')
                 oldCart.foodsList = carts
                 console.log(oldCart,'未提交的json')
                 let saveMcart = await cart.findByIdAndUpdate(oldCart._id,{
                     $set:{
                       foodsList:oldCart.foodsList,
                       openid:oldCart.openid,
                       createTime:oldCart.createTime
                     }
                 })
                 if(saveMcart){
                     //保存修改的购物车
                     console.log('1245')
                 }
             }else
             {
                 console.log('此次购物车已经全部提交');
                 console.log(oldCart);
                 let removeCart=await cart.findOneAndRemove({
                     _id:oldCart._id
                 })
             }
            ctx.body = {
                code:0,
                msg:`需支付金额${sum}元`,
                money:sum
            }
         }else{
             ctx.body  ={
                 code:-1,
                 "msg":'创建订单失败'
             }
         }
    }
    else{
        ctx.body = {
            code:-1,
            msg:'请添加商品'
        }
    }
});
export default router