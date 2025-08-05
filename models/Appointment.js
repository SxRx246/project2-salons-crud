const mongoose = require("mongoose")


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
    services:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required: true

    }],
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
})

const Appointment = mongoose.model("Appointment",appointmentSchema)
module.exports = Appointment