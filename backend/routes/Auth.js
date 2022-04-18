const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const bodyparser = require("body-parser");
const { body, param, validationResult } = require('express-validator');
router.use(bodyparser());
router.use(bodyparser.urlencoded({ extended: false }));

router.post("/register", body("email").isEmail(), body("name"), async (req, res) => {
    console.log(req.body)
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {name, email, password} = req.body;
        bcrypt.hash(password, 10, async function(err, hash) {
            if(err){
               res.status(400).json({
                    status: "failed",
                    message: "Invalid details"
                })
            }
            const user = await User.create(
                {
                    name, 
                    email, 
                    password:hash
                }
            );
            res.status(200).json({
                status: "success",
                data:user
            })
        });

    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
})

router.post("/login", body("email").isEmail(), body("password").isLength( 10), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({
                status:"failed",
                message:"Invalid user"
            })
            return;
        }
        bcrypt.compare(password, user.password).then(function(result) {
            if(result){
                var token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                  }, process.env.SECRET);
                res.status(200).json({
                    status: "success",
                    token
                })
            }else{
                res.status(400).json({
                    status: "failed",
                    message: "User Not Authenticated"
                })
            }
        });

    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
})

module.exports = router;