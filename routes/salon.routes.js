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






// router.get("/",async(req,res)=>{
//     try{
//         const allBooks = await Book.find().populate("author")
//         console.log(allBooks)
//         res.render("books/all-books.ejs",{allBooks: allBooks})
//     }
//     catch(error){
//         console.log(error)
//     }
// })


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

// 1. get the book by the id
// 2. add the new comment to the book.comments array
// 3. save the book with the updated comment
// 4. redirect back to the books details

// router.post("/:bookId/comment",async(req,res)=>{
//     try{
//         const foundBook = await Book.findById(req.params.bookId)
//         console.log(foundBook)
//         foundBook.comments.push(req.body)
//         foundBook.save()
//         res.redirect(`/books/${foundBook._id}`)

//     }
//     catch(error){
//         console.log(error)
//     }
// })


// UPDATE

router.get("/:id/edit",async(req,res)=>{
    try{
        const foundSalon = await Salon.findById(req.params.id)
        res.render("salons/edit.ejs",{foundSalon})
    }
    catch(error){
        console.log(error)
    }
})


router.put("/:id",async(req,res)=>{
    await  Salon.findByIdAndUpdate(req.params.id, req.body)
    res.redirect("/salons/"+req.params.id)
})


// export the router
module.exports = router

// exercise create the author routes