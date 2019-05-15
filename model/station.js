import mongoose from 'mongoose'
const Schema = mongoose.Schema
const station = new Schema({
     stationName:{
        type:String
     },
     childName:{
         type:Array
     }
})
export default mongoose.model('station',station)