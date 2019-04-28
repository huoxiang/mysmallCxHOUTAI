import koa2 from 'koa2'
import bodyparser from 'koa-bodyparser'
import user from './router/user/index'
import Foods from './router/foods/foods'
import mongoose from 'mongoose'
import config from './config/config'
import session from 'koa-generic-session'
import Redis from 'koa-redis'
const app = new koa2()
app.keys=['tg','keys']
app.proxy=true
app.use(session({
    key:'tg',
    prefix:'mt:uid',
    store:new Redis()
}))
mongoose.connect(config.dbs,{
    useNewUrlParser:true
})

app.use(bodyparser())
app.use(user.routes()).use(user.allowedMethods())
app.use(Foods.routes()).use(Foods.allowedMethods())
app.listen(8080)
