const express = require("express")
const app = express()
const mongoose = require('mongoose')
const cors = require("cors")
const User = require("./models/User")
const uri = "mongodb+srv://chetkiy:giv8070808@cluster0.vwrr4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(cors({
    origin: "*"
}))


mongoose.connect(uri)
    .then(() => {
        console.log("Conected to Mongo")
        app.listen(8080, () => console.log("server started"))
    })
    .catch(err => console.log(err))



app.post("/register", async (req, res) => {

    try {
        const {email, password} = req.body

        const hashPassword = bcrypt.hashSync(password, 7)
    
        const newUser = await User.create({
            email,
            password: hashPassword
        })

        const response = {
            "status": "success",
            "message": "User created",
            newUser
        }

        res.status(201).json(response)
    } catch(err) {

        const response = {
            "status": "error",
            "message": err.message
        }

        res.status(400).json(response)
    }
})


app.post("/login", async (req, res) => {
        try {
            const user = await User.findOne({email: req.body.email})

            if (user) {
                const isValidPassword = await bcrypt.compare(req.body.password, user.password)

                if (isValidPassword) {

                    const response = {
                        "status": "success",
                        "message": "Log in success",
                        user
                    }
                    res.status(200).json(response)
                } else {

                    const response = {
                        "status": "error",
                        "message": "Incorrect password"
                    }
                    
                    res.json(response)
                }
            } else {

                const response = {
                    "status": "error",
                    "message": "Not found user with this Email"
                }
                res.json(response)
            }
        } catch(err) {
            const response = {
                "status": "error",
                "message": err.message
            }

            res.json(response)
        }
})


app.post("/update", async (req, res) => {
    const condition = {
        _id: req.body.userId
    }

    const updateData = {}

    if (req.body.email) {
        updateData.email = req.body.email
    }

    if (req.body.password) {
        updateData.password = bcrypt.hashSync(req.body.password, 7)
    }


    try {

        const updateUser = await User.findOneAndUpdate(condition, updateData)
        
        const response = {
            "status": "success",
            "message": "Update data success",
            updateUser
        }

        res.json(response)

    } catch(err) {
        const response = {
            "status": "error",
            "message": err.message,
        }

        res.json(response)
    }
})


