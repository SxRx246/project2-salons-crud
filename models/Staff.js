const mongoose = require("mongoose")

const staffSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "name is required" ],
    },
    // we can make it as a range in the future
    speciality:{
        type:String,
        required:[true, "speciality is required"]
    }
    ,
    yearsOfExperience:{
        type:Number,
        required:true
    }
    ,
    salon:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Salon",
        required:true
    }

})

const Staff = mongoose.model("Staff",staffSchema)

module.exports = Staff