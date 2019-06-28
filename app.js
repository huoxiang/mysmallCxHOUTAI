import koa2 from 'koa2'
import cors from 'koa2-cors'
import bodyparser from 'koa-bodyparser'
import user from './router/user/index'
import Foods from './router/foods/foods'
import cart from './router/cart/cart'
import auto from './router/autograph/aut'
import head from './router/head/head'
import order from './router/order/order'
import setCom from './router/setCom/setCom'
import mongoose from 'mongoose'
import config from './config/config'
import path from 'path'
import server from 'koa-static'//搭建静态资源服务,方便下载订单导出的表格
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
const staticPath = './public'
const home = server(
   path.join(__dirname,staticPath)
   )
app.use(cors())
mongoose.connect(config.dbs,{
    useNewUrlParser:true
})
app.use(home)
app.use(bodyparser())
app.use(user.routes()).use(user.allowedMethods())
app.use(Foods.routes()).use(Foods.allowedMethods())
app.use(auto.routes()).use(auto.allowedMethods())
app.use(cart.routes()).use(cart.allowedMethods())
app.use(head.routes()).use(head.allowedMethods())
app.use(order.routes()).use(order.allowedMethods())
app.use(setCom.routes()).use(setCom.allowedMethods())
app.listen(8080)