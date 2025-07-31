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

        // // Map services
        // const services = serviceName.map((name, index) => ({
        //     name,
        //     price: servicePrice[index],
        //     description: serviceDescription[index],
        //     salon: newSalon._id // Associate each service with the newly created salon
        // }));

        // // Save each service
        // for (const serviceData of services) {
        //     const service = new Service(serviceData); // Create a new Service instance
        //     await service.save(); // Save the service
        //     newSalon.services.push(service._id); // Add service ID to the salon's services
        // }


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

        await newSalon.save(); // Save the updated salon with the services

        const foundSalon = {
            name,
            location,
            openingTime,
            closingTime,
            workingDays,
            services: serviceNames.length === 0 ? [] : [] // Services will be an empty array if none
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



// router.post("/", async (req, res) => {
//     console.log("boooooooody:  "+ req.body); // Log the request body for debugging
//     const { name, location, openingTime, closingTime, workingDays, serviceName, price, description } = req.body;

//     // Ensure serviceName, price, and description are arrays
//     if (!Array.isArray(serviceName) || !Array.isArray(price) || !Array.isArray(description)) {
//         return res.status(400).send("Service data is missing or incorrectly formatted");
//     }

//     try {

//         const days = Array.isArray(workingDays) ? workingDays : [workingDays];

//         // Create the salon
//         const newSalon = await Salon.create({
//             name,
//             location,
//             openingTime,
//             closingTime,
//             workingDays: days
//         });

//         // // Map services
//         // const services = serviceName.map((name, index) => ({
//         //     name,
//         //     price: price[index],
//         //     description: description[index],
//         //     salon: newSalon._id // Associate each service with the newly created salon
//         // }));

//                 // Prepare services array
//         // const services = Array.isArray(serviceName)
//         //     ? serviceName.map((name, index) => ({
//         //           name,
//         //           price: price[index],
//         //           description: description[index],
//         //           salon: newSalon._id
//         //       }))
//         //     : [{
//         //           name: serviceName,
//         //           price: price,
//         //           description: description,
//         //           salon: newSalon._id
//         //       }];

//     //     const services = Array.isArray(serviceName)
//     // ? serviceName.map((name, index) => ({
//     //       serviceName: name, // ✅ Corrected
//     //       price: price[index],
//     //       description: description[index],
//     //       salon: newSalon._id
//     //   }))
//     // : [{
//     //       serviceName: serviceName, // ✅ Corrected
//     //       price: price,
//     //       description: description,
//     //       salon: newSalon._id
//     //   }];

//             const services = serviceName.map((name, index) => ({
//             serviceName: name,
//             price: price[index],
//             description: description[index],
//             salon: newSalon._id
//         }));

//         // Save each service
//         for (const serviceData of services) {
//             if (!serviceData.serviceName) {
//                 return res.status(400).send("Service name cannot be empty.");
//             }

//             const service = new Service(serviceData);
//             await service.save();
//             newSalon.services.push(service._id);
//             console.log("Service data: "+ serviceData)
//         }
        
//         console.log("new salon:"+newSalon);
//         await newSalon.save();
//         res.redirect(`/salons/${newSalon._id}`);

//         // Render the salon details page
//         res.render("salon-details.ejs", {
//             name,
//             location,
//             openingTime,
//             closingTime,
//             workingDays,
//             services
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error creating salon or services");
//     }
// });


// router.post("/salons", async (req, res) => {
//     try {
//         const {
//             name,
//             location,
//             openingTime,
//             closingTime,
//             workingDays,
//             serviceName,
//             price,
//             description
//         } = req.body;

//         // 1. Create the new service
//         const newService = new Service({
//             name: serviceName,
//             price,
//             description
//         });
//         await newService.save();

//         // 2. Create the salon and reference the service
//         const newSalon = new Salon({
//             name,
//             location,
//             openingTime,
//             closingTime,
//             workingDays: Array.isArray(workingDays) ? workingDays : [workingDays],
//             services: [newService._id]
//         });
//         await newSalon.save();

//         // res.render("/salons"); // or wherever you list salons
//         // res.rend/er("salons/all-salons.ejs",{allSalons})
//         res.render("salon-details.ejs", {
//             name,
//             location,
//             openingTime,
//             closingTime,
//             workingDays,
//             services
//         });

//     } catch (err) {
//         console.error("Error creating salon:", err);
//         res.status(500).send("Internal Server Error");
//     }
// });






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

// router.get("/:id/edit",async(req,res)=>{
//     try{
//                 const foundSalon = await Salon.findById(req.params.id).populate("services");

//         const days =["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

//         const selectedDays = days.map((day)=>{
//             if(foundSalon.workingDays.includes(day)){return {day,selected:true}}
//             else{return {day,selected:null}}
//         })
//         console.log(selectedDays)

//         res.render("salons/edit.ejs",{foundSalon,selectedDays})
//     }
//     catch(error){
//         console.log(error)
//     }
// })


// router.put("/:id",async(req,res)=>{
//     await  Salon.findByIdAndUpdate(req.params.id, req.body)
//     res.redirect("/salons/"+req.params.id)
// })


// router.delete("/:id", async (req,res)=>{
//     console.log(req.params)
//     try{
//         await Salon.findByIdAndDelete(req.params.id)
//         res.redirect("/salons")
//     }
//     catch(error){
//         console.log(error)
//     }
// })


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
        // Update the salon details
        const updatedSalon = await Salon.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // Handle services
        const { serviceName, servicePrice, serviceDescription } = req.body;

        // Ensure service arrays
        const serviceNames = Array.isArray(serviceName) ? serviceName : [serviceName];
        const servicePrices = Array.isArray(servicePrice) ? servicePrice : [servicePrice];
        const serviceDescriptions = Array.isArray(serviceDescription) ? serviceDescription : [serviceDescription];

        // Clear existing services
        await Service.deleteMany({ salon: updatedSalon._id });

        // Save new services
        for (let i = 0; i < serviceNames.length; i++) {
            const name = serviceNames[i];
            const price = servicePrices[i];
            const description = serviceDescriptions[i];

            // Only save if name, price, and description are provided
            if (name && price && description) {
                const service = new Service({
                    name,
                    price,
                    description,
                    salon: updatedSalon._id,
                });

                await service.save();
                updatedSalon.services.push(service._id); // Add service ID to the salon's services
            }
        }

        await updatedSalon.save(); // Save the updated salon with the new services
        res.redirect(`/salons/${updatedSalon._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating salon or services");
    }
});

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

// export the router
module.exports = router

// exercise create the author routes