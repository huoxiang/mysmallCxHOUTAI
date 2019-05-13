import Router from 'koa-router'
import user from '../../model/user';
import htuser from '../../model/htUser';
import axios from 'axios'
import Redis from 'koa-redis'
const router = new Router({
  prefix: '/user'
})
let Store = new Redis().client
router.post('/login', async ctx => {
  const appId = 'wx52880aa85d06c07b'
  const appSecret = '7ddc2e491714c36ecc685b645fd9d60d'
  let js_code = ctx.request.body.code
  const data = await axios.get('https://api.weixin.qq.com/sns/jscode2session',{
   params:{
    appid:appId,
    secret:appSecret,
    js_code,
    grant_type:'authorization_code'
   }
  })
  
  //将用户的openid存入数据库
  // console.log(data.data,'data')
  // Store.hmset(`session_key:${data.data.openid}`,'session_key',data.data.session_key)
  try{
    let newUser = await user.create({
      openid:data.data.openid,
      phone:""
    })
    //后期获取用户号码在存入数据库，增加用户体验
    ctx.body = {
      code:0,
      openid:data.openid,
      msg:'注册成功'
    }
  }catch(err){
    let res = await user.findOne({
      openid:data.data.openid
    })
    console.log(res)
    ctx.body={
      code:-1,
      openid:res.openid,
      msg:'注册失败'
    } 
  }
 
  
  //获取到信息后，将openID发放到前端
})
router.post('/setUserInfo',async ctx=>{
     console.log(ctx.request.body)
    //  let saveSession_key = await Store.hget(`session_key:${ctx.request.body.openid}`,'session_key')
     console.log(saveSession_key,'key')
    ctx.body ={
       code:0,
       msg:'请重试...'
    }
})
router.post('/register', async ctx => {
  let {
    username,
    password,
    phone
  } = ctx.request.body
  let esuser = await user.find({
    username
  })
  if (esuser.length) {
    ctx.body = {
      code: -1,
      msg: '当前用户已经被注册'
    }
    return false
  }
  let nuser = await user.create({
    username,
    password,
    phone
  })
  if (nuser) {
    ctx.body = {
      code: 0,
      msg: '注册成功'
    }
  } else {
    ctx.body = {
      code: -1,
      msg: '注册失败'
    }
  }
})
router.post('/regis',async ctx=>{
  //管理系统登陆注册操作接口
  const {user,password,name} = ctx.request.body
  console.log(user,password,name)
 
  try {
    let res = await htuser.create({
      user,password,name
    })
    ctx.body={
      code:0,
      msg:'注册成功'
    }
  } catch(err){
    ctx.body={
      code:-1,
      msg:'注册失败，当前用户已经存在'
    }
  }
})
router.post('/signup', async ctx => {
  let {user,password} = ctx.request.body
  console.log(user,password)
  let res =  await htuser.findOne({
     user
  })
  console.log(res)
  ctx.body={
    code:0,
    data:res
  }
  //   global.console.log('123')
  // let {username,password } = ctx.request.body
  //   //判断数据库是否存在该用户，不存在就提醒注册
  // let esuser= await user.findOne({
  //    username
  // })
  // console.log(esuser)
  // if(esuser.username == username && esuser.password ==password)
  // {
  //     console.log('登陆成功')
  //     ctx.body = {
  //         code:0,
  //         msg:'登陆成功'
  //     }
  // }else{
  //   ctx.body = {
  //       code:-1,
  //       msg:'账号或密码错误'
  //   }
  // }
  //   if(esuser){
  //       ctx.body={
  //           code:0,
  //           msg:'用户已注册可以登陆'
  //       }
  //   }
  // 获取微信的授权id
})
export default router