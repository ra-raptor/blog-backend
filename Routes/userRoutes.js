import express, { Router } from "express";
import cookieParser from "cookie-parser";
import {
	userDetails,
	userLogin,
	userLogout,
	userSignup,
} from "../Controllers/userController.js";
import checkAuth from "../Middlewares/checkAuth.js";
const router = Router();
import cors from "cors";
router.use(express.json());
router.use(cookieParser());
router.use(
	cors({
		origin: ["https://shayrana.netlify.app", "http://localhost:3000"],
		credentials: true,
	})
);

router.get("/logout", userLogout);

router.post("/login", userLogin);

router.post("/signup", userSignup);

router.get("/me", checkAuth, (req, res) => {
	const { _id } = req.currUser;
	res.json({
		success: true,
		_id,
	});
});

router.get("/:id", userDetails);

export default router;
