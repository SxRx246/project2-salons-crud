// import the model
const Salon = require("../models/Salon")
const User = require("../models/User")
// import the router
const router = require("express").Router()



// write your routes

router.get("/",async(req,res)=>{
    try{
        const allSalons = await Salon.find()
        res.render("salons/all-salons.ejs",{allSalons})
    }
    catch(error){
        console.log(error)
    }
})

router.get("/new",async(req,res)=>{
    try{
        res.render("salons/new.ejs")
    }
    catch(error){
        console.log(error)
    }

})


router.post("/",async(req,res)=>{
    try{
        await Salon.create(req.body)
        res.redirect("/salons")
    }
    catch(error){
        console.log(error)
    }
})



router.get("/:id",async(req,res)=>{
    try{
        const foundSalon = await Salon.findById(req.params.id)
        console.log(foundSalon)
        res.render("salons/salon-details.ejs",{foundSalon})
    }
    catch(error){
        console.log(error)
    }
})



// UPDATE

router.get("/:id/edit",async(req,res)=>{
    try{
                const foundSalon = await Salon.findById(req.params.id)

        const days =["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

        const selectedDays = days.map((day)=>{
            if(foundSalon.workingDays.includes(day)){return {day,selected:true}}
            else{return {day,selected:null}}
        })
        console.log(selectedDays)

        res.render("salons/edit.ejs",{foundSalon,selectedDays})
    }
    catch(error){
        console.log(error)
    }
})


router.put("/:id",async(req,res)=>{
    await  Salon.findByIdAndUpdate(req.params.id, req.body)
    res.redirect("/salons/"+req.params.id)
})


router.delete("/:id", async (req,res)=>{
    console.log(req.params)
    try{
        await Salon.findByIdAndDelete(req.params.id)
        res.redirect("/salons")
    }
    catch(error){
        console.log(error)
    }
})


// export the router
module.exports = router

// exercise create the author routes