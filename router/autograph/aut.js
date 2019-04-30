//此接口返回一些需要的签名信息
import Router from 'koa-router'
import  aliOss  from '../../config/config'
const router = new Router({
    prefix:'/auth'
})
router.post('/getAliSelect',async ctx=>{
     ctx.body = {
         code:0,
         data:aliOss.aliOss
     }
})
export default router