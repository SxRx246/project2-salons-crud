const Salon = require("../models/Salon")
const User = require("../models/User")
const Service = require("../models/Service")
const Staff = require("../models/Staff")

const router = require("express").Router()


router.get("/", async (req, res) => {
    try {
        const userId = req.session.user?._id || null;
        let foundUser = null;

        if (userId) {
            foundUser = await User.findById(userId);
        }
        const allSalons = await Salon.find()
        res.render("salons/all-salons.ejs", { allSalons, foundUser })
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/new", async (req, res) => {
    const userId = req.session.user?._id || null;
    let foundUser = null;

    if (userId) {
        foundUser = await User.findById(userId);
    }
    try {
        res.render("salons/new.ejs", { servicesCount: 0, foundUser });
    }
    catch (error) {
        console.log(error)
    }

})



router.post("/", async (req, res) => {
    const userId = req.session.user?._id || null;
    let foundUser = null;

    if (userId) {
        foundUser = await User.findById(userId);
    }
    console.log("all data " + req.body)
    const { name, description, location, openingTime, closingTime, workingDays, serviceName, servicePrice, serviceDescription, staffName, staffSpeciality, yearsOfExperience } = req.body;

    try {
        const newSalon = await Salon.create({
            name,
            description,
            location,
            openingTime,
            closingTime,
            workingDays
        });

        const serviceNames = Array.isArray(serviceName) ? serviceName : [serviceName];
        const servicePrices = Array.isArray(servicePrice) ? servicePrice : [servicePrice];
        const serviceDescriptions = Array.isArray(serviceDescription) ? serviceDescription : [serviceDescription];

        if (serviceNames.length === 0 || serviceNames.every(name => !name)) {
            console.log("No services added.");
        } else {
            const services = serviceNames.map((name, index) => ({
                name,
                price: servicePrices[index],
                description: serviceDescriptions[index],
                salon: newSalon._id
            }));

            for (const serviceData of services) {
                const service = new Service(serviceData);
                await service.save();
                newSalon.services.push(service._id);
            }

        }

        const staffNames = Array.isArray(staffName) ? staffName : [staffName];
        const staffSpecialitys = Array.isArray(staffSpeciality) ? staffSpeciality : [staffSpeciality];
        const yearsOfExperiences = Array.isArray(yearsOfExperience) ? yearsOfExperience : [yearsOfExperience];

        if (staffNames.length === 0 || staffNames.every(name => !name)) {
            console.log("No services added.");
        } else {
            const staffs = staffNames.map((name, index) => ({
                name,
                speciality: staffSpecialitys[index],
                yearsOfExperience: yearsOfExperiences[index],
                salon: newSalon._id
            }));

            for (const staffData of staffs) {
                const staff = new Staff(staffData);
                await staff.save();
                newSalon.staffs.push(staff._id);
            }

        }

        await newSalon.save();

        const foundSalon = {
            name,
            description,
            location,
            openingTime,
            closingTime,
            workingDays,
            services: serviceNames.length === 0 ? [] : [],
            staffs: staffNames.length === 0 ? [] : []
        }
        res.render("salons/salon-details.ejs", {
            foundSalon, foundUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error creating salon or services");
    }
});



router.get("/:id", async (req, res) => {
    try {
        const userId = req.session.user?._id || null;
        let foundUser = null;

        if (userId) {
            foundUser = await User.findById(userId);
        }
        const foundSalon = await Salon.findById(req.params.id).populate("services").populate("staffs")
        console.log(foundSalon.services.length)
        res.render("salons/salon-details.ejs", { foundSalon, foundUser })
    }
    catch (error) {
        console.log(error)
    }
})



router.get("/:id/edit", async (req, res) => {
    try {
        const userId = req.session.user?._id || null;
        let foundUser = null;

        if (userId) {
            foundUser = await User.findById(userId);
        }
        const foundSalon = await Salon.findById(req.params.id).populate("services").populate("staffs");

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const selectedDays = days.map((day) => {
            return { day, selected: foundSalon.workingDays.includes(day) };
        });

        res.render("salons/edit.ejs", { foundSalon, selectedDays, foundUser });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching salon details");
    }
});



router.put("/:id", async (req, res) => {
    try {
        console.log("REQ.bODY", req.body);

        const updatedSalon = await Salon.findByIdAndUpdate(req.params.id, req.body, { new: true });

        const { serviceName, servicePrice, serviceDescription, serviceId, staffName, staffSpeciality, yearsOfExperience, staffId } = req.body;

        const serviceNames = Array.isArray(serviceName) ? serviceName : [serviceName];
        const servicePrices = Array.isArray(servicePrice) ? servicePrice : [servicePrice];
        const serviceDescriptions = Array.isArray(serviceDescription) ? serviceDescription : [serviceDescription];
        const serviceIds = Array.isArray(serviceId) ? serviceId : [serviceId];

        for (let i = 0; i < serviceNames.length; i++) {
            const name = serviceNames[i];
            const price = servicePrices[i];
            const description = serviceDescriptions[i];
            const id = serviceIds[i];

            if (id) {
                await Service.findByIdAndUpdate(id, { name, price, description });
            } else if (name && price && description) {
                const newService = new Service({
                    name,
                    price,
                    description,
                    salon: updatedSalon._id,
                });
                await newService.save();
                updatedSalon.services.push(newService._id);
            }
        }


        const staffNames = Array.isArray(staffName) ? staffName : [staffName];
        const staffSpecialitys = Array.isArray(staffSpeciality) ? staffSpeciality : [staffSpeciality];
        const yearsOfExperiences = Array.isArray(yearsOfExperience) ? yearsOfExperience : [yearsOfExperience];
        const staffIds = Array.isArray(staffId) ? staffId : [staffId];


        for (let i = 0; i < staffNames.length; i++) {
            const name = staffNames[i];
            const speciality = staffSpecialitys[i];
            const yearsOfExperience = yearsOfExperiences[i];
            const id = staffIds[i];

            if (id) {
                await Staff.findByIdAndUpdate(id, { name, speciality, yearsOfExperience });
            } else if (name && speciality && yearsOfExperience) {

                const newStaff = new Staff({
                    name,
                    speciality,
                    yearsOfExperience,
                    salon: updatedSalon._id,
                });
                await newStaff.save();
                updatedSalon.staffs.push(newStaff._id);
            }
        }

        await updatedSalon.save();
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
        await Service.deleteMany({ salon: req.params.id });
        res.redirect("/salons");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting salon");
    }
});

// Deleting a Service
router.get("/:salonID/:serviceID", async (req, res) => {
    try {

        await Service.findByIdAndDelete(req.params.serviceID);
        res.redirect(`/salons/${req.params.salonID}`);

    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting salon");
    }
})

// Deleting a Staff
router.get("/:salonID/:staffID/DeleteStaff", async (req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.staffID);
        res.redirect(`/salons/${req.params.salonID}`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting salon");
    }
});


module.exports = router

