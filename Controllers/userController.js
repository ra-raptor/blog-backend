import User from "../Models/user.js";
import Blog from "../Models/blog.js";
import bcrpt from "bcrypt";
import jwt from "jsonwebtoken";

export const userLogout = (req, res) => {
	try {
		res.clearCookie("user").json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Server Error",
		});
	}
};

export const userLogin = async (req, res) => {
	const { email, password } = req.body;
	if (!password) {
		res.status(400).json({
			success: false,
			message: "Password is required",
		});
		return;
	}
	console.log(email, password);
	try {
		const currUser = await User.findOne({ email: email });
		if (!currUser) {
			res.json({
				success: false,
				message: "User not found",
			});
		} else {
			bcrpt.compare(password, currUser.password, (err, result) => {
				if (err) {
					res.status(400).json({
						success: false,
						message: "Password Error",
					});
				} else {
					if (result) {
						const token = jwt.sign(
							{ _id: currUser._id },
							process.env.JWTSECRET,
							{ expiresIn: "1d" }
						);
						res
							.cookie("user", token, {
								maxAge: 1000 * 60 * 60 * 24 * 30,
								httpOnly: true,
								sameSite: "none",
								secure: true,
							})
							.json({
								success: true,
								_id: currUser._id,
							});
					} else {
						res.status(401).json({
							success: false,
							message: "Incorrect Password",
						});
					}
				}
			});
		}
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Server Error",
		});
	}
};

export const userSignup = async (req, res) => {
	const { email, fname, lname, dob, password, confirm } = req.body;
	try {
		const currUser = await User.findOne({ email: email });
		if (currUser) {
			res.json({
				success: false,
				message: "User already exists",
			});
			return;
		}
		if (!password || password !== confirm) {
			res.json({
				success: false,
				message: "Passwords do not match",
			});
		} else {
			const date = new Date(dob);
			const salt = await bcrpt.genSalt(parseInt(process.env.SALTROUNDS));
			bcrpt.hash(password, salt, async (err, hash) => {
				if (err) {
					res.status(500).json({
						success: false,
						message: "Server Error",
					});
				} else {
					const newUser = await User.create({
						email: email,
						fname: fname,
						lname: lname,
						dob: date,
						doc: new Date(Date.now()),
						password: hash,
						salt: salt,
					});
					const token = jwt.sign({ _id: newUser._id }, process.env.JWTSECRET, {
						expiresIn: "1d",
					});
					// console.log(token);
					//console.log(salt , hash);
					res
						.cookie("user", token, {
							maxAge: 1000 * 60 * 60 * 24 * 30,
							httpOnly: true,
							sameSite: "none",
							secure: true,
						})
						.json({
							success: true,
							_id: newUser._id,
						});
				}
			});
		}
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Server Error",
		});
	}
};

export const userDetails = async (req, res) => {
	try {
		const reqid = await User.find({ _id: req.params.id });
		if (reqid.length === 0) {
			res.status(404).json({
				success: false,
				message: "User not found",
			});
		} else {
			const { _id, email, fname, lname, dob, doc } = reqid[0];
			const blogCount = await Blog.countDocuments({ author: req.params.id });
			const temp = await Blog.find({ author: req.params.id }).select("views");
			const blogs = await Blog.find({ author: req.params.id });
			let viewCount = 0;
			temp.forEach((item) => {
				viewCount += item.views;
			});
			res.json({
				success: true,
				user: {
					_id,
					email,
					fname,
					lname,
					dob,
					doc,
					blogCount,
					viewCount,
				},
				blogs,
				// blogs : temp
			});
		}
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "Server Error",
		});
	}
};
