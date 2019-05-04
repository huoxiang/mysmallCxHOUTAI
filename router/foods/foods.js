import Router from 'koa-router'
import category from '../../model/foodscategory'
import foods from '../../model/foods'
const router = new Router({
    prefix: "/foods"
})
router.post('/upload', async ctx => {
    console.log(ctx)
})
router.get('/getFoodsList', async ctx => {
    
    //需要多少条数据，默认不传参数为前十条数据
    let start =parseInt(ctx.query.start) //这边可以改为接收参数后的计算
    let pageSize = 10 //每一页显示的数据条数
    let arr = []
    let arrLength = await foods.find()
    let res = await foods.find().skip(start).limit(pageSize).exec()
        arr = res.map(item => {
            return {
                number: item.number,
                foodsName: item.foodsName,
                foodsPrice: item.foodsPrice,
                foodsdescribe: item.foodsdescribe
            }
        })
    let sa = arrLength.length/10
    sa = Math.ceil(sa)
    console.log(sa)
    ctx.body= {
        code:0,
        data:arr,
        num:sa
    }
})
router.get('/addCategory', async ctx => {
    //增加商品接口
    //分类id
    //分类名称
    //分类排列序号
    let findName = await category.find({
        cateGoryName: ctx.query.name
    })
    let findId = await category.find({
        cateGoryId: ctx.query.id
    })
    if (findName.length > 0 || findId > 0) {
        ctx.body = {
            code: -1,
            msg: "已经存在的分类.."
        }
    } else {
        let res = await category.create({
            cateGoryId: ctx.query.id,
            cateGoryName: ctx.query.name,
            selectId: ctx.query.selectId
        })
        if (res) {
            ctx.body = {
                code: 0,
                msg: '添加分类成功'
            }
        }
    }
})
router.get('/addFoods', async ctx => {
    //增加商品的接
    //也需要进行验证,判断数据库中是否存在相同的内容
    let oldFoods = await foods.find({
        foodsName: ctx.query.foodsName
    })
    if (oldFoods.length > 0) {
        ctx.body = {
            code: 0,
            msg: '数据库中已经存在该项商品'
        }
        return false
    }
    let res = await foods.create({
        foodsName: ctx.query.foodsName,
        foodsPrice: ctx.query.price,
        foodsdescribe: ctx.query.Specifications,
        oldPrice: ctx.query.oldPrice,
        foodsImgList: ctx.query['uploadImgList[]'],
        couponSelected: ctx.query.couponSelected,
        number: ctx.query.number,
        content: ctx.query.content
    })
    if (res) {
        ctx.body = {
            code: 0,
            msg: '添加商品成功'
        }
    } else {
        ctx.body = {
            code: -1,
            msg: '添加商品失败'
        }
    }
})
router.get('/getFoodsDetail', async ctx => {
    //获取商品详细信息的接口

})
router.get('/searchFoods',async ctx=>{
    //搜索商品,应该是模糊查询,后期在考虑模糊查询
    console.log(ctx.query)
    ctx.body = {
        code:0,
        msg:ctx.query.name
    }


})
router.get('/downFoods', async ctx => {
    //下架商品,
    //上架商品一个表，下架商品一个表
    //删除的商品一个表
})
router.get('/upFoods', async ctx => {
    //上架商品，先进行测试
    console.log(ctx.query)
    let data = await foods.create({
        foodsName: '肉',
        foodsPrice: '80',
        foodsdescribe: 'aasfasga',
        foodsImgList: ctx.query.data
    })
    if (data) {
        ctx.body = {
            code: 0,
            msg: '上传成功'
        }
    }
})
router.get('/getCategory', async ctx => {
    //获取分类接口，此处需要进行排列,selectId越大排列越靠前
    const data = await category.find()
    let arr = data.map(item => {
        return {
            cateGoryId: item.cateGoryId,
            cateGoryName: item.cateGoryName,
            selectId: item.selectId
        }
    })
    arr.sort((a, b) => b.selectId - a.selectId)
    ctx.body = {
        code: 0,
        masg: '获取成功',
        data: arr
    }
})
router.get('/arrayFoods', async ctx => {
    //传入id获得,对应id的商品

})
export default router