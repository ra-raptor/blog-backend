import { categoryHelper } from "../Utils/categoryHelper.js";
import Blog from "../Models/blog.js";
import User from "../Models/user.js";
import category from "../Models/category.js";

export const createBlog = async (req, res) => {
	const { title, text, image, categories } = req.body;
	let category = await categoryHelper(categories);
	try {
		const newBlog = await Blog.create({
			title: title,
			text: text,
			image: image,
			like: 0,
			views: 0,
			time: new Date(Date.now()),
			categories: category,
			author: req.currUser._id,
		});
		res.json({
			success: true,
			id: newBlog._id,
		});
	} catch (err) {
		res.json({
			success: false,
			message: "Error in creating blog",
		});
	}
};

export const updateBlog = async (req, res) => {
	const { title, text, image, categories } = req.body;
	let category = await categoryHelper(categories);
	try {
		const blog = await Blog.findOne({ _id: req.params.id });
		if (blog) {
			blog.title = title;
			blog.text = text;
			blog.image = image;
			blog.categories = category;
			await blog.save();
			res.json({
				success: true,
				message: "Blog updated",
			});
		} else {
			res.json({
				success: false,
				message: "Blog not found",
			});
		}
	} catch (err) {
		res.json({
			success: false,
			message: "Error in updating blog",
		});
	}
};

export const viewBlog = async (req, res) => {
	try {
		const blog = await Blog.findOne({ _id: req.params.id });
		if (blog) {
			const author = await User.findById(blog.author);
			const { fname, lname, email } = author;
			res.json({
				success: true,
				blog: blog,
				authorDetails: {
					id: blog.author,
					fname,
					lname,
					email,
				},
			});
		} else {
			res.status(404).json({
				success: false,
				message: "Blog not found",
			});
		}
	} catch (err) {
		res.status(404).json({
			success: false,
			message: "Blog not found",
		});
	}
};

export const deleteBlog = async (req, res) => {
	try {
		const blog = await Blog.findOne({ _id: req.params.id });
		if (blog) {
			await blog.deleteOne();
			res.json({
				success: true,
				message: "Blog deleted",
			});
		} else {
			res.json({
				success: false,
				message: "Blog not found",
			});
		}
	} catch (err) {
		res.json({
			success: false,
			message: "Error in deleting blog",
		});
	}
};

export const blogList = async (req, res) => {
	try {
		const cat = await category.findOne({ name: req.query.category });
		let blogs = await Blog.find({ categories: { $in: cat } })
			.populate({
				path: "author",
				select: "fname lname _id",
			})
			.populate("categories");
		if (blogs.length == 0) {
			blogs = await Blog.find()
				.populate({
					path: "author",
					select: "fname lname _id",
				})
				.populate("categories");
		}
		if (req.query.sort === "views") {
			res.json({
				success: true,
				blogs: blogs.sort((a, b) => {
					return b.views - a.views;
				}),
			});
		} else if (req.query.sort === "like") {
			res.json({
				success: true,
				blogs: blogs.sort((a, b) => {
					return b.like - a.like;
				}),
			});
		} else {
			res.json({
				success: true,
				blogs: blogs.sort((a, b) => {
					return b.time - a.time;
				}),
			});
		}
	} catch (err) {
		console.log(err);
		res.status(400).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

export const likeBlog = async (req, res) => {
	const blog = await Blog.findById(req.params.id);
	if (blog) {
		blog.like = blog.like + 1;
		await blog.save();
		res.json({
			success: true,
			message: "Blog liked",
		});
	} else {
		res.status(404).json({
			success: false,
			message: "Blog not found",
		});
	}
};

export const visitBlog = async (req, res) => {
	try {
		console.log(req.params.id);
		const blog = await Blog.findOne({ _id: req.params.id });
		if (blog) {
			blog.views = blog.views + 1;
			await blog.save();
			res.status(200).json({
				success: true,
				message: "Blog viewed",
			});
		} else {
			res.status(404).json({
				success: false,
				message: "Blog not found",
			});
		}
	} catch (err) {
		res.status(400).json({
			success: false,
			message: "Something went wrong",
		});
	}
};
