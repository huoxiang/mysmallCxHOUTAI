import Router from 'koa-router'
import foods from '../../model/foods'
import cart from '../../model/cart'
const router = new Router({
    prefix:'/carts'
})
router.get('/addCarts',async ctx=>{
    //先创建合集再往里面加入数据
    const {openId,foodsId,count} = ctx.query
    //拿到用户openId,商品id,增加数量 
    let oldCart = await cart.findOne({
        openid:openId
    })
    if(oldCart){
        console.log('已经存在购物车')
        ctx.body={
            code:0,
            msg:"存在购物车"
        }
    }
    else{
        console.log('不存在购物车')
         console.log(new Date().getTime())
         let arr = []
        let addfoods = await foods.findOne({
            foodsid:foodsId
        })
        let cartFoodsObj = {
            img:addfoods.foodsImgList[0],
            name:addfoods.foodsName,
            foodsPrice:addfoods.foodsPrice,
            count:1
        }
        arr.push(cartFoodsObj)
         console.log(arr)
        let newCart = await cart.create({
            openid:openId,
            foodsList:arr,
            createTime:new Date().getTime(),
        })
        if(newCart){
            ctx.body={
                code:0,
                msg:"加入购物车成功"
            }
        }else{
            ctx.body={
                code:-1,
                msg:"不存在购物车"
            }
        }
       
    }
    // console.log(foodsId)
    // let res = await foods.find({
    //     foodsid:foodsId
    // })
    // console.log(res)
    //如果购物车表中不存在用户的购物车

})
router.get('/searchCart',async ctx=>{
    //获得用户购物车的接口
    //需要传入openid
    const { openid } =ctx.query
    let res =await cart.findOne({
        openid
    })
    console.log(res)
    ctx.body = {
        code:0,
        data:res
    }
})
export default router