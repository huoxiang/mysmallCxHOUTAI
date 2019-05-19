import Router from 'koa-router'
import order from '../../model/order'
import cart from '../../model/cart'
const router = new Router({
    prefix:'/order'
})
router.post('/createOrder',async ctx=>{
    console.log('调用该接口')
    const {openid,paylist} = ctx.request.body
    console.log(openid,paylist)
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
    console.log(newARR)
    //获得传入id的商品
    if(newARR.length>0){
          //选取了购物车的数据
          let sum=0
          //设置价格
          newARR.map((item,index)=>{
              sum+=item.foodsPrice*item.count
          })
         console.log(sum)
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