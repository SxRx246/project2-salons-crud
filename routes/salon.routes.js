// import the model
const Salon = require("../models/Salon")
const User = require("../models/User")
const Service = require("../models/Service")

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
        res.render("salons/new.ejs", { servicesCount: 0 });
    }
    catch(error){
        console.log(error)
    }

})


router.post("/", async (req, res) => {
    const { name, location, openingTime, closingTime, workingDays, serviceName, servicePrice, serviceDescription } = req.body;

    try {
        // Create the salon
        const newSalon = await Salon.create({
            name,
            location,
            openingTime,
            closingTime,
            workingDays
        });

        // Map services
        const services = serviceName.map((name, index) => ({
            name,
            price: servicePrice[index],
            description: serviceDescription[index],
            salon: newSalon._id // Associate each service with the newly created salon
        }));

        // Save each service
        for (const serviceData of services) {
            const service = new Service(serviceData); // Create a new Service instance
            await service.save(); // Save the service
            newSalon.services.push(service._id); // Add service ID to the salon's services
        }

        await newSalon.save(); // Save the updated salon with the services

        // Render the salon details page
        res.render("salon-details.ejs", {
            name,
            location,
            openingTime,
            closingTime,
            workingDays,
            services
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating salon or services");
    }
});






router.get("/:id",async(req,res)=>{
    try{
        const foundSalon = await Salon.findById(req.params.id).populate("services")
        console.log(foundSalon.services.length)
        res.render("salons/salon-details.ejs",{foundSalon})
    }
    catch(error){
        console.log(error)
    }
})



// UPDATE

router.get("/:id/edit",async(req,res)=>{
    try{
                const foundSalon = await Salon.findById(req.params.id).populate("services");

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