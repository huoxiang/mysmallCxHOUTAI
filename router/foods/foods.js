import Router from 'koa-router'
import category  from '../../model/foodscategory'
import multer from 'koa-multer'
const router = new Router({
    prefix:"/foods"
})
let storage = multer.diskStorage({
    //文件保存路径
    destination:(req,file,cb) =>{
         
        console.log(req)
       cb(null,'public/uploads/')
    },
    //修改文件名称
    filename:(req,file,cb)=>{
        let fileFormt = (file.originalname).split(".")
        cb(null,Date.now()+"."+fileFormt[fileFormt.length-1])
    }
})
//加载配置
let upload = multer({storage:storage})
router.post('/upload', async ctx=>{
     console.log(ctx)
})
router.get('/addFoods',async ctx =>{
   //增加商品接口
   //分类id
   //分类名称
   //分类排列序号
   let findName  = await category.find({
    cateGoryName:ctx.query.name
   })
   let findId = await category.find({
    cateGoryId:ctx.query.id  
   })
   if(findName.length > 0 || findId > 0){
    ctx.body = {
        code:-1,
        msg:"已经存在的分类.."
    }  
   }else{
       let res = await category.create({
        cateGoryId:ctx.query.id,
        cateGoryName:ctx.query.name,
        selectId:ctx.query.selectId
       })
       if(res){
           ctx.body = {
               code:0,
               msg:'添加分类成功'
           }
       }
   }
})
router.get('/getFoodsDetail',async ctx=>{
  //获取商品详细信息的接口
   

})
router.get('/downFoods',async ctx=>{
    //下架商品,
    //上架商品一个表，下架商品一个表
    //删除的商品一个表
})
router.get('/upFoods',async ctx=>{
    //上架商品
})
router.get('/getCategory',async ctx=>{
    //获取分类接口，此处需要进行排列,selectId越大排列越靠前
    const data = await category.find()
    let arr = data.map(item=>{
        return {
           cateGoryId:item.cateGoryId,
           cateGoryName:item.cateGoryName,
           selectId:item.selectId
        }
    })
    arr.sort((a,b)=>b.selectId - a.selectId)
    console.log(arr)
    ctx.body = {
        code:0,
        masg:'获取成功',
        data:arr
    }
})
router.get('/arrayFoods',async ctx=>{
    //传入id获得,对应id的商品
    
})
export default router