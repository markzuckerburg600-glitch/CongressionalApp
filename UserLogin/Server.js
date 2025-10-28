import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cors from "cors"

import FlashcardModel  from "./models/flashcardModel.js"
import userModel from "./models/userModel.js"

dotenv.config()

const app = express()
// We can use json 
app.use(express.json())
app.use(cors())

/* sign in */
app.post("/users", async (req, res) => {
    try {
        const {username, password} = req.body
        const existingUser = await userModel.findOne({username})
        if (existingUser){
            return res.status(400).send("User already exists")
        }
        // salt is used for security, adds onto password
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new userModel({ username: username, password: hashedPassword })
        await user.save()
        res.status(200).send("User created")
    } catch (error){
        res.status(500).send("Server error")
    }
})
/* Login */
app.post("/users/login", async (req,res)=>{
    // Checking if the user name is in the users list
    const {username, password} = req.body
    try{
    /* Find a user */
    const user = await userModel.findOne({username})
    if (!user){
        return res.status(400).send("Cannot find user")
    }
    const findPasswordMatch = await bcrypt.compare(password, user.password)
    if (!findPasswordMatch){
        res.send("Wrong password")
    }
    // Create JWT token that's different for every user and login
    // Cretaes a token that proves someones identity for login
    const token = jwt.sign(
    // Mongodb auto creates the userid
        {id: user._id, username: user.username},
        process.env.JWT_SECRET, // Secret key in .env
        {expiresIn: "1d"} // Expires in 1 day
    )   
        console.log(token)
        return res.json({token})
}   catch (error){
        res.status(400).send("Server error")
    }
})

// Create a card
app.post("/createcards", (req, res) =>{
    const {flashcards} = req.body
})

// Delete a card
app.delete("/createcards", (req, res)=>{
    const {flashcard} = req.body
    
})


mongoose.connect(process.env.MONGO_URL)
.then(()=> {
    app.listen(process.env.PORT, ()=>{
        console.log("Connected to db and listening on port")
    })
})
.catch((error) =>{
    console.log(error)
})


