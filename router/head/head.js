import Router  from 'koa-router'
import head from '../../model/Head'
import order from '../../model/order'
import Excel from 'exceljs'
import send from 'koa-send'

//实例化·E
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
router.get('/exportExcel',async ctx=>{
    let fills = {
        solid: {type: "pattern", pattern:"solid", fgColor:{argb:"FFFFAAAA"}}
    }
    var workbook = new Excel.Workbook()
    var ws1 = workbook.addWorksheet("测试一");
    ws1.addRow(["订单号","下单时间","订单金额","商品"]);
    ws1.addRow(["总人口", "不可计数"]);
    ws1.addRow(["类型", "动物", "非动物"]);
    ws1.addRow(["统计日期", "1111-11-11 11:11:11"]);
    ws1.addRow();
    
    //A6:E6
    ws1.addRow(["你", "在", "说些", "神马", "呢？"]);
    ws1.getCell("A6").fill = fills.solid;
    ws1.getCell("B6").fill = fills.solid;
    ws1.getCell("C6").fill = fills.solid;
    ws1.getCell("D6").fill = fills.solid;
    ws1.getCell("E6").fill = fills.solid;
    
    //7 - 13(A7:A13) - 7
    ws1.addRow(["什么跟神马", 10, 1, "凡人修仙传", 7]);
    ws1.addRow(["","","","一号遗迹", 2]);
    ws1.addRow(["","","","六号遗迹", 0]);
    ws1.addRow(["","","","古国一号", 0]);
    ws1.addRow(["","","","锻体期", 0]);
    ws1.addRow(["","","","合体期", 0]);
    ws1.addRow(["","","","没资质", 1]);
    
    
    ws1.mergeCells("A7:A13")
    ws1.mergeCells("B7:B13")
    ws1.mergeCells("C7:C13")
    
    //a6-e13 a b c d e
    //ws1.getCell('A7').alignment = { vertical: 'middle', horizontal: 'center' };
    
    rowCenter(ws1, 6, 13);　
    colWidth(ws1, [1,2,3,4,5], 20);
    
    var ws2 = workbook.addWorksheet("测试二");
    
    
    var ws3 = workbook.addWorksheet("测试三");
    workbook.xlsx.writeFile('test2.xlsx')
    .then(function(){
        console.log('生成 xlsx');
      send(ctx,'../../test2.xlsx')
        });
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
router.get('/allsHead',async ctx=>{
    //此接口返回所有团长
    let res = await head.find({})
    console.log(res)
    if(res.length>0){
        ctx.body={
            code:0,
            data:res
        }
    }else{
        ctx.body={
            code:-1,
            msg:"没有团长"
        }
    }
  
})
router.get('/orderList',async ctx=>{
    //此接口和返回商品列表类似
    //传入相应的页数返回
    //或者只是显示当前月份
    let start = parseInt(ctx.query.start)
    let pagesSize=10
    let arr = []
    let arrLength = await order.find()
    let res = await order.find().skip(start).limit(pagesSize).exec()
    console.log(res)
    let sa = arrLength.length/10
    sa=Math.ceil(sa)
    ctx.body={
        code:0,
        data:res,
        pageNum:sa+1
    }
})
//按开团时间算
//导出订单是按一次团购去导出
//一个团长导出一次订单
//一次团购时间按时间戳来算为两天
//前端发起获得请求后,获得当前时间减去两天的团购时间，从数据库获取这两天的团购时间,为一次一个团长的订单
router.get('/getoneHeadOrder',async ctx=>{
     const {headid} = ctx.query
     //传入团长id
     //必须使用当天的凌晨减去两天的时间，防止后期出现问题
     let date = new Date()
     //获取当前的时间
     //转换时间戳
     console.log(date)
     let time = date.getTime()
     console.log(time)
}) 
function rowCenter(arg_ws, arg_start, arg_end) {
    for(let i = arg_start; i <= arg_end; i++) {
        arg_ws.findRow(i).alignment = { vertical: 'middle', horizontal: 'center' };
        //循环 row 中的　cell，给每个 cell添加边框
        arg_ws.findRow(i).eachCell(function (cell, index) {
            cell.border = {
                top: {style:'thin'},
                left: {style:'thin'},
                bottom: {style:'thin'},
                right: {style:'thin'}
            };
        })

    }
}

//设置　start-end 列的宽度
function colWidth(arg_ws, arg_cols, arg_width) {
    for(let i in arg_cols) {
        arg_ws.getColumn(arg_cols[i]).width = arg_width;
    }
}
export default router