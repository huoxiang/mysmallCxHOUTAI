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
      
    }
})
export default router