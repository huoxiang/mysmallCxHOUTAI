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
        //如果用户的购物车已经存在
      
        let c = oldCart.foodsList.map(item=>{
             console.log(item)
             if(item.foodsid==foodsId){
                 console.log('已经存在')
                 return {
                     name:item.name,
                     foodsPrice:item.foodsPrice,
                     count:item.count+1,
                     foodsid:item.foodsid 
                    }
             }
        })
        console.log(c)
        oldCart.foodsList = c
        console.log(oldCart,'修改过的购物车数据')
        let res = await cart.findByIdAndUpdate(oldCart._id,{$set:{
             foodsList:oldCart.foodsList,
             openid:oldCart.openid,
             createTime:oldCart.createTime
        }})
        if(res){
            ctx.body={
                code:0,
                msg:"添加购物车成功"
            }
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
            foodsid:addfoods.foodsid,
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