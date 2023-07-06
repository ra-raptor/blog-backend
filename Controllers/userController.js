import User from "../Models/user.js";
import Blog from "../Models/blog.js";
import bcrpt from "bcrypt";
import jwt from "jsonwebtoken";

export const userLogout = (req,res) => {
    res.clearCookie("user").json({
        success : true
    })
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    const currUser = await User.findOne({email : email})
    if(!currUser){
        res.json({
            success : false,
            message : "User not found"
        })
    }else{
        bcrpt.compare(password, currUser.password, (err, result) => {
            if(err){
                res.json({
                    success : false,
                    message : "Server Error"
                })
            }else{
                if(result){
                    const token = jwt.sign({_id : currUser._id}, process.env.JWTSECRET, {expiresIn : "1d"})
                    res.cookie("user", token, {
                        maxAge : 1000*60*60*24*30,
                        httpOnly : true,
                        sameSite : "none",
                        secure : true,
                        
                    }).json({
                        success : true,
                    })
                }else{
                    res.json({
                        success : false,
                        message : "Incorrect Password"
                    })
                }
            }
        })
    }
}

export const userSignup = async (req, res) => {
    const { email,fname,lname, dob,password,confirm } = req.body;
    const currUser = await User.findOne({email : email})
    if(currUser){
        res.json({
            success : false,
            message : "User already exists"
        })
        return
    }
    if(!password || password !== confirm ){
        res.json({
            success : false,
            message : "Passwords do not match"
        })
    }else{
        const date = new Date(dob);
        const salt = await bcrpt.genSalt(parseInt(process.env.SALTROUNDS));
        bcrpt.hash(password, salt, async (err, hash) => {
            if(err){
                res.status(500).json({
                    success : false,
                    message : "Server Error"
                })
            }else{
                 const newUser = await User.create({
                    email : email,
                    fname : fname,
                    lname : lname,
                    dob : date,
                    doc : new Date(Date.now()),
                    password : hash,
                    salt : salt
                })
                const token = jwt.sign({_id : newUser._id}, process.env.JWTSECRET, {expiresIn : "1d"})
                // console.log(token);
                //console.log(salt , hash);
                res.cookie("user", token, {
                    maxAge : 1000*60*60*24*30,
                    httpOnly : true,
                    sameSite : "none",
                    secure : true,
                }).json({
                    success : true,
                })
            }
        })
    }
}

export const userDetails = async (req, res) => {
    const {email,fname,lname,dob,doc} = req.currUser;
    const blogCount = await Blog.countDocuments({author : req.currUser._id})
    const likeCount = await Blog.aggregate([{$match : {author : req.currUser._id}},{$group : {_id : null, total : {$sum : "$like"}}}])
    const viewCount = await Blog.aggregate([{$match : {author : req.currUser._id}},{$group : {_id : null, total : {$sum : "$views"}}}])
   
    
    // number of blogs 
    // number of views
    // number of likes
    res.json({
        success : true,
         users : {
            email, fname,lname,dob,doc,blogCount,
            likeCount : likeCount.length === 0 ? 0 : likeCount[0].total,
            viewCount : viewCount.length === 0 ? 0 : viewCount[0].total
         }
    })
}