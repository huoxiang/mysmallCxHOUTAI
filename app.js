import koa2 from 'koa2'
import cors from 'koa2-cors'
import bodyparser from 'koa-bodyparser'
import user from './router/user/index'
import Foods from './router/foods/foods'
import auto from './router/autograph/aut'
import mongoose from 'mongoose'
import config from './config/config'
// import session from 'koa-generic-session'
// import Redis from 'koa-redis'
const app = new koa2()
app.keys=['tg','keys']
app.proxy=true
// app.use(session({
//     key:'tg',
//     prefix:'mt:uid',
//     store:new Redis()
// }))
app.use(cors({
    origin:ctx=>{
        return "*"//允许所有域名跨域
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
mongoose.connect(config.dbs,{
    useNewUrlParser:true
})
app.use(bodyparser())
app.use(user.routes()).use(user.allowedMethods())
app.use(Foods.routes()).use(Foods.allowedMethods())
app.use(auto.routes()).use(auto.allowedMethods())
app.listen(8080)
