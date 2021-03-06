const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

//Register
router.post("/register", 
	body('email').isEmail(), // For eamil systax
	body('password').isLength({ min: 8 }),
	(req,res) =>{
	const { username, email, password } = req.body
	const errors = validationResult(req)

	if(!errors.isEmpty()){
		return res.status(400).json({ errors: errors.array() })
	}

	User.findOne({ "email": email }, (err, user) =>{
		if(user){
			return res.status(400).json({ message: "User already exists" })
		} else{
			let user = new User()
			user.username = username;
			user.email = email

			//Hash the password
			let salt = bcrypt.genSaltSync(10)
			let hash = bcrypt.hashSync(password, salt)
			user.password = hash
			user.save()
			return res.json({
				message: "Registered Successfully",
				user: user
			})
		}
	})
})

//Login localhost:4000/users/login
router.post("/login", (req, res) =>{
	const { email, password } = req.body

	User.findOne({ email }, (err, user) =>{
		if(!user) return res.status(400).json({ message: "User Doesn't exist" })
		if(err) return res.status(400).json({ err })

		let isMatch = bcrypt.compareSync(password, user.password)
	if(!isMatch) return res.status(400).json({ message: "Invalid Credentials"})

		let payLoad = {
			user: {
				id: user.id, 
				email: user.email,
				username: user.username,
				isAdmin: user.isAdmin
			}
		}

		jwt.sign(
			payLoad,
			"mysecretkey",
			{ expiresIn: "3h" },
			(err, token) =>{
				if(err) return res.status(400).json({ err })
					return res.json({token})
			}
		)
	})
})

module.exports = router