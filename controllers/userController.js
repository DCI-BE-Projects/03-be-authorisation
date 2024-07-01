import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSignup = async (req, res) => {
	try {
		const { firstName, email, password } = req.body;

		//Check if user already exists
		let existingUser = await userModel.findOne({ email });

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "User with this email already exists!!!" });
		}

		const newUser = new userModel({
			firstName,
			email,
			password,
		});
		console.log("Old user info: ", newUser);

		//Hash the password for the new user in order to save DB
		const salt = await bcrypt.genSalt(10);
		newUser.password = await bcrypt.hash(password, salt);

		console.log("updated user info: ", newUser);

		await newUser.save();
		// res.status(201).json(newUser);

		// Create JSON WT token
		const payload = {
			newUser: {
				id: newUser._id,
				name: newUser.firstName,
			}
		}

		jwt.sign(payload, "randomString", {expiresIn:"1h"}, (err,token)=> {
			if(err) throw err;
			res.status(200).json({token});
		})
	} catch (error) {
		res.json(error);
	}
};


export const userLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		let user = await userModel.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect password" });
		}
	} catch (error) {

	}
}