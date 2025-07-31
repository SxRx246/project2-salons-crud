// import the model
const Salon = require("../models/Salon")
const User = require("../models/User")
const Service = require("../models/Service")
const Staff = require("../models/Staff")

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
    console.log("all data "+req.body)
    const { name, location, openingTime, closingTime, workingDays, serviceName, servicePrice, serviceDescription , staffName, staffSpeciality, yearsOfExperience} = req.body;

    try {
        // Create the salon
        const newSalon = await Salon.create({
            name,
            location,
            openingTime,
            closingTime,
            workingDays
        });

        // Ensure serviceName, price, and description are arrays
        const serviceNames = Array.isArray(serviceName) ? serviceName : [serviceName];
        const servicePrices = Array.isArray(servicePrice) ? servicePrice : [servicePrice];
        const serviceDescriptions = Array.isArray(serviceDescription) ? serviceDescription : [serviceDescription];

        // Check if any services are provided
    if (serviceNames.length === 0 || serviceNames.every(name => !name)) {
        // No services provided, handle accordingly
        console.log("No services added.");
    } else {
        // Map services
        const services = serviceNames.map((name, index) => ({
            name,
            price: servicePrices[index],
            description: serviceDescriptions[index],
            salon: newSalon._id // Associate each service with the newly created salon
        }));

        // Save each service
        for (const serviceData of services) {
            const service = new Service(serviceData); // Create a new Service instance
            await service.save(); // Save the service
            newSalon.services.push(service._id); // Add service ID to the salon's services
        }

    }

    // Ensure serviceName, price, and description are arrays
    const staffNames = Array.isArray(staffName) ? staffName : [staffName];
    const staffSpecialitys = Array.isArray(staffSpeciality) ? staffSpeciality : [staffSpeciality];
    const yearsOfExperiences = Array.isArray(yearsOfExperience) ? yearsOfExperience : [yearsOfExperience];

        // Check if any services are provided
    if (staffNames.length === 0 || staffNames.every(name => !name)) {
        // No services provided, handle accordingly
        console.log("No services added.");
    } else {
        // Map services
        const staffs = staffNames.map((name, index) => ({
            name,
            speciality: staffSpecialitys[index],
            yearsOfExperience: yearsOfExperiences[index],
            salon: newSalon._id // Associate each service with the newly created salon
        }));

        // Save each service
        for (const staffData of staffs) {
            const staff = new Staff(staffData); // Create a new Service instance
            await staff.save(); // Save the service
            newSalon.staffs.push(staff._id); // Add service ID to the salon's services
        }

    }

        await newSalon.save(); // Save the updated salon with the services

        const foundSalon = {
            name,
            location,
            openingTime,
            closingTime,
            workingDays,
            services: serviceNames.length === 0 ? [] : [] ,// Services will be an empty array if none
            staffs: staffNames.length === 0 ? [] : [] // Services will be an empty array if none
        }
        // Render the salon details page
        res.render("salons/salon-details.ejs", {
            foundSalon
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating salon or services");
    }
});



router.get("/:id",async(req,res)=>{
    try{
        const foundSalon = await Salon.findById(req.params.id).populate("services").populate("staffs")
        console.log(foundSalon.services.length)
        res.render("salons/salon-details.ejs",{foundSalon})
    }
    catch(error){
        console.log(error)
    }
})



// UPDATE
router.get("/:id/edit", async (req, res) => {
    try {
        const foundSalon = await Salon.findById(req.params.id).populate("services");

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const selectedDays = days.map((day) => {
            return { day, selected: foundSalon.workingDays.includes(day) };
        });

        res.render("salons/edit.ejs", { foundSalon, selectedDays });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching salon details");
    }
});



router.put("/:id", async (req, res) => {
    try {
        console.log("REQ.bODY", req.body);

        // Update the salon details
        const updatedSalon = await Salon.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Handle services
        const { serviceName, servicePrice, serviceDescription, serviceId } = req.body;

        // Ensure service arrays
        const serviceNames = Array.isArray(serviceName) ? serviceName : [serviceName];
        const servicePrices = Array.isArray(servicePrice) ? servicePrice : [servicePrice]; // Ensure this is an array
        const serviceDescriptions = Array.isArray(serviceDescription) ? serviceDescription : [serviceDescription]; // Ensure this is an array
        const serviceIds = Array.isArray(serviceId) ? serviceId : [serviceId]; // Ensure this is an array

        // Update existing services and create new services
        for (let i = 0; i < serviceNames.length; i++) {
            const name = serviceNames[i];
            const price = servicePrices[i];
            const description = serviceDescriptions[i];
            const id = serviceIds[i];

            if (id) {
                // Update existing service
                await Service.findByIdAndUpdate(id, { name, price, description });
                // await Service.findByIdAndUpdate(id, { serviceName, servicePrice, serviceDescription });
            } else if (name && price && description) {
                // Create a new service if name, price, and description are provided
                const newService = new Service({
                    name,
                    price,
                    description,
                    salon: updatedSalon._id, // Associate with the salon
                });
                await newService.save();
                updatedSalon.services.push(newService._id); // Add the new service ID to the salon's services
            }
        }

        await updatedSalon.save(); // Save the updated salon with the new services
        res.redirect(`/salons/${updatedSalon._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating salon or services");
    }
});

// Deleting a Salon
router.delete("/:id", async (req, res) => {
    try {
        await Salon.findByIdAndDelete(req.params.id);
        await Service.deleteMany({ salon: req.params.id }); // Optionally delete services associated with the salon
        res.redirect("/salons");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting salon");
    }
});

// Deleting a Service
router.get("/:salonID/:serviceID", async (req, res) => {
    try {
        // console.log("this is the salon id"+req.params.salonId)

        await Service.findByIdAndDelete(req.params.serviceID);
        // await Service.deleteMany({ salon: req.params.id }); // Optionally delete services associated with the salon
        res.redirect(`/salons/${req.params.salonID}`);
        // res.redirect(`/salons`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting salon");
    }
})

// Deleting a Staff
router.get("/:salonID/:staffID/DeleteStaff", async (req, res) => {
    try {
        // console.log("this is the salon id"+req.params.salonId)

        await Staff.findByIdAndDelete(req.params.staffID);
        // await Service.deleteMany({ salon: req.params.id }); // Optionally delete services associated with the salon
        res.redirect(`/salons/${req.params.salonID}`);
        // res.redirect(`/salons`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting salon");
    }
});


module.exports = router

