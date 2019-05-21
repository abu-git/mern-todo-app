const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const isEmpty = require('is-empty');
const Validator = require('validator');


//Load input validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

//Load User model
const User = require('../models/User');

router.post('/register', (req, res) => {
	//Form Validation
	const { errors, isValid } = validateRegisterInput(req.body);

	//Check Validation
	if(!isValid){
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email })
		.then(user =>{
			if(user){
				return res.status(400).json({ email: "Email already exists"});
			}

			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				password: req.body.password
			});

			//Hash password before saving in database
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) =>{
					if (err) throw err;
					newUser.password = hash;
					newUser.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			}); 
		})
});


router.post("/login", (req, res) => {
	//Form Validation
	const { errors, isValid } = validateLoginInput(req.body);

	//Check Validation
	if(!isValid){
		res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	//Find user by email
	User.findOne({ email }).then(user => {
		//Check if user exists
		if(!user){
			return res.status(400).json({ emailnotfound: "Email not found" });
		}

		//Check Password
		bcrypt.compare(password, user.password).then(isMatch => {
			if(isMatch){
				//User matched
				const username = user.name;
				res.status(200).json({ user: username });
			}else{
				return res.status(400).json({ passwordincorrect: "Password incorrecct" });
			}
		});
	});
});

module.exports = router;