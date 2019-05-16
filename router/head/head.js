import Router  from 'koa-router'
import head from '../../model/Head'
const router = new Router({
    prefix:'/head'
})
router.get('/addHeader',async ctx=>{
     console.log('123')
     const { phone,name,address,openid,longitude,latitude,city} = ctx.query
     let res = await head.create({
         phone,name,address,latitude,longitude,openid,city,status:0
     })
     if(res){
         //申请成功
         ctx.body = {
             code:0,
             msg:`申请成功,等待审核`
         }
     }
     else
     {
        ctx.body = {
             code:0,
             msg:`申请出现问题`
         }
     }
})
router.get('/examineHead',async ctx=>{
    //审核团长的接口，传入参数status,还需传入openid,为2就T通过,为1就直接删除该条申请,
    const {status,openid} = ctx.query
    let res = await head.findOne({
        openid
    })
   // console.log(res)
    let id = res._id
    console.log(id)
    if(status==1){
        let removeRes = await head.remove({
            openid
        })
        if(removeRes){
            ctx.body ={
                code:0,
                msg:'已经撤销了申请'
            }
        }
    }
    if(status==2){
        let result = await head.findByIdAndUpdate(id,{$set:{
           status:2
        }})
        if(result){
            ctx.body = {
                code:0,
                msg:'此操作为通过该次申请'
            }
        }
    }
})
router.get('/allHead',async ctx=>{
    //返回所有团长申请的接口
     let res = await head.find({
         status:0
     })
     ctx.body = {
         code:0,
         data:res
     }
})
router.get('/isHead',async ctx=>{
    //判断是否是团长
    const {openid} = ctx.query
    const res = await head.findOne({
        openid
    })
    if(res){
        ctx.body = {
            code:0,
            msg:"用户是团长"
        }
    }else{
        ctx.body = {
            code:-1,
            msg:'用户不是团长'
        }
    }
})
router.get('/searchHead',async ctx=>{
    //根据用户给的城市返回当前城市团长的位置
    const { city } = ctx.query
    let res = await head.find({
        city
    })
    if(res.length>0){
        ctx.body = {
            code:0,
            data:res
        }
    }
    else{
        ctx.body = {
           code:-1,
           msg:"当前地区没有团长，你可以自己申请"
        }
    }
})
export default router