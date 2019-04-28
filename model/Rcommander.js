//团长的数据模型
import mongoose from 'mongoose'
const schema  = mongoose.Schema
const rc = new schema({
    //团长的账号
    rcInfo:{
        type:String,
        require:true
    },
    Name:{
        type:String,
        require:true
    },
    id:{
      //团长Id
      type:Number,
      require:true
    },
    address:{
        type:String,
        require:true
    },
    longitude:{
        //经度
        type:Number,
        require:true
    },
    latitude:{
        //纬度
        type:Number,
        require:true
    }

})
export default mongoose.model('rc',rc)