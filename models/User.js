const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true, "username is required" ],
        unique: [true, "username already taken please pick another username"]
    },
    password:{
        type:String,
        required:[true, "password is required"]
    },
    // typeOfUser:{
    //     type:String,
    //     enum:["owner", "staff", "customer"],
    //     required: true
    // }
})

const User = mongoose.model("User",userSchema)

module.exports = User