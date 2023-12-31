import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./Models/category.js";
import Blog from "./Models/blog.js";
import userRoutes from "./Routes/userRoutes.js";
import blogRoutes from "./Routes/blogRoutes.js";
import cors from "cors";
const app = express();
dotenv.config();
const port = 5000;

app.use(express.json());
app.use(
	cors({
		origin: ["https://shayrana.netlify.app", "http://localhost:3000"],
		credentials: true,
	})
);

const catHelper = async (all_cat) => {
	const catList = [];
	for (const cat of all_cat) {
		const count = await Blog.countDocuments({ categories: { $in: [cat._id] } });
		if (count > 0) {
			catList.push(cat);
		}
	}
	return catList;
};

app.get("/cat", async (req, res) => {
	try {
		const r = await Category.find();
		const cat = await catHelper(r);
		res.status(200).json({
			success: true,
			list: cat,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
});

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

// app.get('/', async (req,res) => {
//     const r = await Category.find()

//     res.json({
//         success : true,
//         categories : r
//     })
// })

app.listen(port, (req, res) => {
	console.log(`Server is running on ${port}`);
	mongoose
		.connect(process.env.MONGOURI)
		.then(() => {
			console.log("Connected to DB");
		})
		.catch((err) => {
			console.log(err);
		});
});
