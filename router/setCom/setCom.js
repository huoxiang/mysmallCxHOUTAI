import Router from 'koa-router'
import setCom from '../../model/Comsets'
const router = new Router({
    prefix:'/setCom'
})
router.get('/getNum',async ctx=>{
  //获得数据库中已经存在的商品数据配置
   let res = await setCom.find()
   ctx.body = {
       code:0,
       data:res[0].Proportion
   }
})
router.post('/set',async ctx=>{
    console.log('调用设置佣金比例的接口')
    const {setNum} = ctx.request.body
    const findRes = await setCom.find()
    if(findRes.length>0){
        //判断是否传入值
        //1.未传入，不操作
        //2.传入了进行数据修改操作
        if(setNum){
          let setS = await setCom.findByIdAndUpdate(findRes[0]._id,{
              $set:{
                  Proportion:setNum
              }
          })
          ctx.body = {
              code:0,
              msg:'修改成功'
          }
        }else{
            ctx.body = {
                code:-1,
                msg:'您当前并没有传入数据'
            }
            return false
        }
    }else{
        setCom.create({
            Proportion:0.8
        })  
        ctx.body={
            code:0,
            msg:'初始化数据库成功'
        }  
    }
})
export default router