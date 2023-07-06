import express, { Router } from "express";
import cookieParser from "cookie-parser";
import {userDetails, userLogin, userLogout, userSignup} from "../Controllers/userController.js"
import checkAuth from "../Middlewares/checkAuth.js";
const router = Router();

router.use(express.json());
router.use(cookieParser());
router.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "*");
    const allowedOrigins = ['http://localhost:3000',];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
  });

router.get("/logout", checkAuth, userLogout)

router.post("/login", userLogin)

router.post("/signup", userSignup)

router.get("/",checkAuth, userDetails)

export default router;