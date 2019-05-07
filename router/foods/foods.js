import Router from 'koa-router'
import category from '../../model/foodscategory'
import foods from '../../model/foods'
import downfoods from '../../model/downFoods'
import OSS from 'ali-oss'
const client = new OSS({
    accessKeyId: 'LTAIDaT373YHmkT',
    accessKeySecret: 'ndTGswjQlWA2uz1m4Du3Drd73ULN13',
    bucket: 'mycz',
    endpoint:'oss-cn-shenzhen.aliyuncs.com'
  });

const router = new Router({
    prefix: "/foods"
})
router.get('/cs',async ctx=>{
    let signUrl = client.signatureUrl('1557200651000560gif.png', {expires: 600, 'process' : 'image/resize,w_300'})
  console.log(signUrl)
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
    console.log(res)
        arr = res.map(item => {
            return {
                number: item.number,
                foodsName: item.foodsName,
                foodsPrice: item.foodsPrice,
                foodsdescribe: item.foodsdescribe,
                id:item.foodsid,
                foodsImgList:item.foodsImgList
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
    console.log(ctx.query)
    let findName = await category.find({
        cateGoryName: ctx.query.name
    })
    let findId = await category.find({
        cateGoryId: ctx.query.id
    })
    console.log(findId,'findid')
    if (findName.length > 0) {
        ctx.body = {
            code: -1,
            msg: "已经存在的分类.."
        }
        return false
    }else{
        if(findId.length>0){
            ctx.body = {
                code: -1,
                msg: "已经存在的ID.."
            }
            return false
        }
        else{
            let res = await category.create({
                cateGoryId:ctx.query.id,
                cateGoryName:ctx.query.name,
                selectId:ctx.query.selectId,
                categoryImg:ctx.query.categoryImg
            })
            if(res){
                ctx.body={
                    code:0,
                    msg:'添加分类成功'
                }
            }
        }
    }
})
router.get('/delCategory',async ctx=>{
    //删除分类接口  
     let foodsArray = await foods.find({
        couponSelected:ctx.query.id
     })
     if(foodsArray.length>0){
         ctx.body={
             code:-1,
             msg:'当前分类存在已经上架的商品不允许删除'
         }
     }
     else
     {
        const id  = ctx.query.id
        let res = await category.remove({
           cateGoryId:id
        })
        if(res){
            ctx.body={
                code:0,
                msg:'删除分类成功'
            }
        }
     }
})
router.get('/categoryFoods',async ctx=>{
    //返回所属分类内容的接口，参数为分类id
    let res = await foods.find({
        couponSelected:ctx.query.couponSelected
    })
   console.log(res)
   let arr = res.map(item => {
            return {
                number: item.number,
                id:item.foodsid,
                foodsName: item.foodsName,
                foodsPrice: item.foodsPrice,
                foodsdescribe: item.foodsdescribe,
                id:item.foodsid
            }
        })
   ctx.body={
       code:0,
       data:arr
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
        foodsid:ctx.query.foodsid,
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
    let key = ctx.query.keyWord
    let search = new RegExp(key)
    let data = await foods.find({
        foodsName:search
    })
   let arr =data.map(item => {
        return {
            number: item.number,
            foodsName: item.foodsName,
            foodsPrice: item.foodsPrice,
            foodsdescribe: item.foodsdescribe,
            id:item.foodsid
        }
    })
    ctx.body = {
        code:0,
        data:arr
    }
})
router.post('/downFoods', async ctx => {
    //下架商品,
    //上架商品一个表，下架商品一个表
    //删除的商品一个表
    console.log(ctx.request.body.data.id)
    let data = await foods.find({
        foodsid:ctx.request.body.data.id
    })
    console.log(data)
    let downRes = await downfoods.create({
        foodsid:data[0].foodsid,
        foodsName: data[0].foodsName,
        foodsPrice: data[0].foodsPrice,
        foodsdescribe: data[0].foodsdescribe,
        oldPrice: data[0].oldPrice,
        foodsImgList: data[0].foodsImgList,
        couponSelected: data[0].couponSelected,
        number: data[0].number,
        content: data[0].content
    })
    let removeRes = await foods.remove({
        foodsid:ctx.request.body.data.id
    })
   console.log(removeRes,'删除foods')
   console.log(downRes,'添加到downfoods')
   if(removeRes && downRes){
    ctx.body={
        code:0,
        msg:'下架成功'
    }
   }  
})
router.post('/upFoods', async ctx => {
    //对已经下架的商品进行操作
    console.log(ctx.request.body.data.id)
    let data = await downfoods.find({
        foodsid:ctx.request.body.data.id
    })
    console.log(data)
    let downRes = await foods.create({
        foodsid:data[0].foodsid,
        foodsName: data[0].foodsName,
        foodsPrice: data[0].foodsPrice,
        foodsdescribe: data[0].foodsdescribe,
        oldPrice: data[0].oldPrice,
        foodsImgList: data[0].foodsImgList,
        couponSelected: data[0].couponSelected,
        number: data[0].number,
        content: data[0].content
    })
    let removeRes = await downfoods.remove({
        foodsid:ctx.request.body.data.id
    })
   console.log(removeRes,'删除downfoods')
   console.log(downRes,'添加到foods')
   if(removeRes && downRes){
    ctx.body={
        code:0,
        msg:'上架成功'
    }
   }  
})
router.get('/getupFoodlist',async ctx=>{
    //获取已经下架的表里面的商品
    let start =parseInt(ctx.query.start) //这边可以改为接收参数后的计算
    let pageSize = 10 //每一页显示的数据条数
    let arr = []
    let arrLength = await foods.find()
    let res = await downfoods.find().skip(start).limit(pageSize).exec()
        arr = res.map(item => {
            return {
                number: item.number,
                foodsName: item.foodsName,
                foodsPrice: item.foodsPrice,
                foodsdescribe: item.foodsdescribe,
                id:item.foodsid
            }
        })
    let sa = arrLength.length/10
    sa = Math.ceil(sa)
    ctx.body= {
        code:0,
        data:arr,
        num:sa
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