import express, { Router } from "express";
import cookieParser from "cookie-parser";
import {userDetails, userLogin, userLogout, userSignup} from "../Controllers/userController.js"
import checkAuth from "../Middlewares/checkAuth.js";
const router = Router();
import cors from 'cors'
router.use(express.json());
router.use(cookieParser());
router.use(cors({credentials: true}))

router.get("/logout", checkAuth, userLogout)

router.post("/login", userLogin)

router.post("/signup", userSignup)

router.get("/",checkAuth, userDetails)

export default router;