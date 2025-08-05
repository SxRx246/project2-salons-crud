const mongoose = require("mongoose")

const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required" ],
        unique: [true, "name already taken please pick another name"]
    },
    price:{
        type:Number,
        required:[true, "Price is required"]
    }
    ,
    description:{
        type:String,
        required:true
    }
    ,
    salon:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Salon",
        required:true
    }

})

const Service = mongoose.model("Service",serviceSchema)

module.exports = Service