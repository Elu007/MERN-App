const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

require('../db/conn');
const User = require("../model/userSchema");

router.get('/', (req, res) => {
    res.send(`Hello World, this is elaf a MERN Stack developer from router`);
});
// Using promises

// router.post('/register', (req,res) =>{
//     const {name, email, phone, work, password, cpassword} = req.body;

//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error:"Please fill the form"});
//     }

//     User.findOne({email:email})
//     .then((userExist) => {
//         if(userExist){
//             return res.status(422).json({error:"Email already exist"});
//         }

//         const user = new User({name, email, phone, work, password, cpassword});

//         user.save().then(() =>{
//             res.status(201).json({message: "User registered successfully"});
//         }).catch((err) => res.status(500).json({error: "Registration failed"}));
//     }).catch(err =>{console.log(err)});

// });

// Using async await

router.post('/register', async (req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;

    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill the form properly" });
    }
    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exist" });
        } else if (password != cpassword) {
            return res.status(422).json({ error: "Passwords are not matching" });
        } else {

            const user = new User({ name, email, phone, work, password, cpassword });
            // Before saving the registration details we will hash the codes
            await user.save();
            return res.status(201).json({ message: "User registered successfully" });
        }

    } catch (err) {
        console.log(err);
    }

});

// login route

router.post('/signin', async (req, res) => {
    // console.log(req.body);
    // res.json({message: "awesome"});
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill the data" })
        }
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);

            const token = await userLogin.generateAuthToken();

            res.cookie("jwtoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });

            if (!isMatch) {
                res.status(400).json({ error: "Invalid Credientials" });
            } else {
                res.json({ message: "User SignIn successfully" })
            }
        } else {
            res.status(400).json({ error: "Invalid Credientials" });
        }


    } catch (err) {
        console.log(err);
    }
})


module.exports = router;