const Appointment = require("../models/Appointment");
const Salon = require("../models/Salon");
const Staff = require("../models/Staff");
const Service = require("../models/Service");
const User = require("../models/User")
const router = require("express").Router()


router.get("/", async (req, res) => {
    try {
        const userId = req.session.user?._id || null;
        let foundUser = null;

        if (userId) {
            foundUser = await User.findById(userId);
        }
        const allAppointments = await Appointment.find().populate("salon").populate("staff").populate("services").populate("customerName")
        console.log(allAppointments)
        res.render("appointments/all-appointments.ejs", { allAppointments, foundUser })
    }
    catch (error) {
        console.log(error)
    }
})

// router.get("/new", async (req, res) => {
//     try {
//         const allStaffs = await Staff.find()
//         const allSalons = await Salon.find()
//         const allServices = await Service.find()
//         res.render("appointments/new.ejs", { allStaffs , allSalons, allServices})
//     }
//     catch (error) {
//         console.log(error)
//     }
// })

// router.get("/new", async (req, res) => {
//     try {
//         const allSalons = await Salon.find();
//         res.render("appointments/new.ejs", { allSalons });
//     } catch (error) {
//         console.log(error);
//     }
// });

router.get("/new", async (req, res) => {
    try {
        const userId = req.session.user?._id || null;
        let foundUser = null;

        if (userId) {
            foundUser = await User.findById(userId);
        }
        const allSalons = await Salon.find();
        const salonId = req.query.salonId;
        const selectedSalon = ""

        let salonStaffs = [];
        let salonServices = [];

        if (salonId) {
            const selectedSalon = await Salon.findById(salonId)
                .populate("staffs")
                .populate("services");
                

            if (selectedSalon) {
                console.log("Staffs:", selectedSalon.staffs);
                console.log("Services:", selectedSalon.services);
                salonStaffs = selectedSalon.staffs;
                salonServices = selectedSalon.services;
            }
        }


        res.render("appointments/new.ejs", {
            allSalons,
            selectedSalon,
            selectedSalonId: salonId,
            salonStaffs,
            salonServices,
            foundUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading form");
    }
});


router.get("/new/:id", async (req, res) => {
    try {
        // const allSalons = await Salon.find();
        const userId = req.session.user?._id || null;
        let foundUser = null;

        if (userId) {
            foundUser = await User.findById(userId);
        }
        const salonId = req.params.id;
        
        let selectedSalon = null;
        let salonStaffs = [];
        let salonServices = [];


        if (salonId) {
            selectedSalon = await Salon.findById(salonId)
                .populate("staffs")
                .populate("services");

            if (selectedSalon) {
                console.log("Staffs:", selectedSalon.staffs);
                console.log("Services:", selectedSalon.services);
                salonStaffs = selectedSalon.staffs;
                salonServices = selectedSalon.services;
            }
        }


    res.render("appointments/new.ejs", {
        selectedSalonId: salonId,
        selectedSalon,
        salonStaffs,
        salonServices,
        foundUser
    });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error loading form");
    }
});

// router.post("/", async (req, res) => {
//     console.log(req.body)
//     try {
//        const newAppointment = await Appointment.create(req.body)
//        console.log("newAppointment "+req.body)
//         res.redirect("/appointments/"+newAppointment._id)
//     }
//     catch (error) {
//         console.log(error)
//     }
// })
router.post("/", async (req, res) => {
    console.log(req.body)
try {
        const username = req.body.customerName; // Get the username from the form
        const { customerName, salon, date, time, services, staff } = req.body;
        // Find the user by username
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Create the appointment using the user's ObjectId
        const appointmentData = {
            customerName: user._id, // Use ObjectId here
            date: req.body.date,
            time: req.body.time,
            salon: req.body.salon,
            services: req.body.services,
            staff: req.body.staff
        };

        const appointment = new Appointment(appointmentData);
        await appointment.save();
        res.redirect("/appointments/"+newAppointment._id)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userId = req.session.user?._id || null;
        let foundUser = null;

        if (userId) {
            foundUser = await User.findById(userId);
        }
        const foundAppointment = await Appointment.findById(req.params.id).populate("staff").populate("salon").populate("services")
        console.log("Found Appointment:", foundAppointment); // Debugging line
        res.render("appointments/appointment-details.ejs", { foundAppointment,foundUser })
    }
    catch (error) {
        console.log(error)
    }
})
// GET route to render the edit page
router.get("/:id/edit", async (req, res) => {
    try {
        const foundAppointment = await Appointment.findById(req.params.id)
            .populate("staff")
            .populate("salon")
            .populate("services");

        // Fetch available salons, staff, and services as needed
        // const allSalons = await Salon.find();
        const salonStaffs = await Staff.find({ salon: foundAppointment.salon });
        const salonServices = await Service.find({ salon: foundAppointment.salon });

        res.render("appointments/edit.ejs", {
            foundAppointment,
            salonStaffs,
            salonServices,
            selectedSalonId: foundAppointment.salon._id
        });
    } catch (error) {
        console.log(error)
    }
});

// PUT route to update the appointment
router.put("/:id", async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect(`/appointments/${req.params.id}`);
    } catch (error) {
        console.log(error)
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id)
        res.redirect("/appointments")
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/:id/:serviceID", async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id)
        res.redirect("/appointments")
    }
    catch (error) {
        console.log(error)
    }
})

router.get("/:appointmentID/:serviceID", async (req, res) => {
    try {
        // console.log("this is the salon id"+req.params.salonId)

        await Service.findByIdAndDelete(req.params.serviceID);
        // await Service.deleteMany({ salon: req.params.id }); // Optionally delete services associated with the salon
        res.redirect(`/appointments/${req.params.appointmentID}`);
        // res.redirect(`/salons`);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in deleting the service");
    }
})


// router.post("/:id/note", async (req, res) => {
//     try {
//         const foundAppointment = await Appointment.findById(req.params.id)
//         foundAppointment.notes.push(req.body)
//         await foundAppointment.save()
//         res.redirect("/appointments/" + req.params.id)

//     }
//     catch (error) {
//         console.log(error)
//     }
// })

// router.delete("/:id/notes/:noteId", async (req, res) => {
//     try {
//         const appointment = await Appointment.findById(req.params.id);
//         appointment.notes = appointment.notes.filter(note => note._id.toString() !== req.params.noteId);
//         await appointment.save();
//         res.redirect("/appointments/" + req.params.id);
//     }
//     catch (error) {
//         console.log(error)
//     }
// });

module.exports = router