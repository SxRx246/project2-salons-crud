const mongoose = require("mongoose")

// const noteSchema = new mongoose.Schema({
//     content:{
//         type:String,
//         required: true
//     },
//     createdAt:{
//         type:Date,
//         default: Date.now
//     }    
// })

const appointmentSchema = new mongoose.Schema({
    customerName:{
        type:String,
        required: true
    },
    date:{
        type:Date,
        required: true
    },
    time:{
        type:String,
        required: true
    },
    service:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required: true

    },
    staff:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Staff",
        required: true
    },
    salon:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Salon",
        required: true
    }
    // notes:[noteSchema]
})

const Appointment = mongoose.model("Appointment",appointmentSchema)
module.exports = Appointment