const mongoose = require("mongoose")

const salonSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required" ],
        unique: [true, "name already taken please pick another name"]
    },
    location:{
        type:String,
        required:[true, "location is required"]
    }
    ,
    openingTime:{
        type:String,
        required:true
    },
    closingTime:{
        type:String,
        required:true
    },
    workingDays:{
        type: [String],
        enum:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }
    // ,
    // staffs:[{    
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"User"
    // }]
    // ,
    // owner: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"User"
    // }

})

const Salon = mongoose.model("Salon",salonSchema)

module.exports = Salon