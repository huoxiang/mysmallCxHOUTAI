import Router from 'koa-router'
import foods from '../../model/foods'
import cart from '../../model/cart'
const router = new Router({
    prefix: '/carts'
})
router.get('/addCarts', async ctx => {
    //先创建合集再往里面加入数据
    const {
        openId,
        foodsId,
        count
    } = ctx.query
    //拿到用户openId,商品id,增加数量 
    let oldCart = await cart.findOne({
        openid: openId
    })
    console.log('商品id', foodsId)
    if (oldCart) {
        //如果用户的购物车已经存在
        //判断购物车列表中是否存在这个商品id
        let _Is; //使用这个值去做判断
        // oldCart.foodsList.forEach((item,index)=>{
        //     console.log(item)
            
        // })
        // for(let i=0;i<oldCart.foodsList.length;i++){
        //     console.log(oldCart.foodsList[i],'for循环')
        //     if(oldCart.foodsList[i].foodsid==foodsId){
        //         //设置_IS为真,//出现bug
        //         _Is=true
        //         break;

        //     }
        //     else{
        //         _Is=false
        //         break;
        //     }
        // }

      let a=oldCart.foodsList.filter(item=>{
            console.log(item)
            return item.foodsid==foodsId
        })
        console.log(a,'过滤出来的')
        a.length>0?_Is=true:_Is=false
        console.log(_Is,'判断')
        //此处引入一个问题js中foreach和map是无法跳出循环的,所以这种时候要使用for循环
        if (_Is) {
            //如果存在这一个商品
            let c = oldCart.foodsList.map(item => {
                if (item.foodsid == foodsId) {
                    return {
                        name: item.name,
                        foodsPrice: item.foodsPrice,
                        count: item.count + 1,
                        foodsid: item.foodsid,
                        img: item.img
                    }
                } else {
                    return {
                        name: item.name,
                        foodsPrice: item.foodsPrice,
                        count: item.count,
                        foodsid: item.foodsid,
                        img: item.img
                    }
                }
            })
            console.log(c, '需要在本身添加')
            oldCart.foodsList = c
            console.log(oldCart.foodsList, '增加')
            let addCart = await cart.findByIdAndUpdate(oldCart._id, {
                $set: {
                    foodsList: oldCart.foodsList,
                    openid: oldCart.openid,
                    createTime: oldCart.createTime
                }
            })
            if (addCart) {
                ctx.body = {
                    code: 0,
                    msg: '添加购物车'
                }
            }
        } else {
            //不存在的话，此物品将加入到购物车中
            console.log('需要重新添加进入购物车')
            let resfood = await foods.findOne({
                foodsid: foodsId
            })
            let newCart = {
                name: resfood.foodsName,
                foodsPrice: resfood.foodsPrice,
                count: 1,
                img: resfood.foodsImgList[0],
                foodsid: resfood.foodsid
            }
            oldCart.foodsList.push(newCart)
            let editRes = await cart.findByIdAndUpdate(oldCart._id, {
                $set: {
                    foodsList: oldCart.foodsList,
                    openid: oldCart.openid,
                    createTime: oldCart.createTime
                }
            })
            if (editRes) {
                ctx.body = {
                    code: 0,
                    msg: '添加购物车'
                }
            }
        }
    } else {
        console.log('不存在购物车')
        console.log(new Date().getTime())
        let arr = []
        let addfoods = await foods.findOne({
            foodsid: foodsId
        })
        let cartFoodsObj = {
            img: addfoods.foodsImgList[0],
            name: addfoods.foodsName,
            foodsPrice: addfoods.foodsPrice,
            foodsid: addfoods.foodsid,
            count: 1
        }
        arr.push(cartFoodsObj)
        console.log(arr)
        let newCart = await cart.create({
            openid: openId,
            foodsList: arr,
            createTime: new Date().getTime(),
        })
        if (newCart) {
            ctx.body = {
                code: 0,
                msg: "加入购物车成功"
            }
        } else {
            ctx.body = {
                code: -1,
                msg: "不存在购物车"
            }
        }

    }
})
router.get('/removeCart',async ctx=>{
    //移除购物车中的商品
    //此操作不可逆
    const {openid,foodsid} = ctx.query
    let oldCart = await cart.findOne({
        openid
    })
    console.log(oldCart)
    let newArr =[]
    oldCart.foodsList.map(item=>{
        if(item.foodsid!=foodsid){
           newArr.push(item)
        }
    })
    console.log(newArr)
    //已经删除了购物车中的商品
    let saveNewCart = await cart.findByIdAndUpdate(oldCart._id,{$set:{
         foodsList:newArr,
         createTime:oldCart.createTime,
         openid:oldCart.openid
    }})
    if(saveNewCart){
        ctx.body={
            code:0,
            msg:'删除成功'
        }
    }
})
router.get('/searchCart', async ctx => {
    //获得用户购物车的接口
    //需要传入openid
    const {
        openid
    } = ctx.query
    let res = await cart.findOne({
        openid
    })
    console.log(res)
    ctx.body = {
        code: 0,
        data: res
    }
})
router.get('/getCartItemSum',async ctx=>{
    //此接口返回用户的购物车商品数量
    const {openid} = ctx.query
    let res = await cart.findOne({
        openid
    })
    if(res){
        let add=0
        res.foodsList.map(item=>{
             add+=item.count
         })
         console.log(add)
         ctx.body = {
             code:0,
             msg:"获取成功",
             data:{
                 num:add
             }
         }
    }else{
        ctx.body = {
            code:0,
            msg:"获取成功",
            data:{
                num:0
            }
        }
    }
  
})
export default router