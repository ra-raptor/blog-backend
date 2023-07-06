import jwt from 'jsonwebtoken';
import User from "../Models/user.js";
const checkAuth = async (req, res, next) => {
    const { user } = req.cookies;
    if(user){
        const { _id } = jwt.verify(user, process.env.JWTSECRET);
        const currUser = await User.findById(_id);
        req.currUser = currUser;
        next();
    }else{
        res.json({
            success : false,
            message : "User not authenticated"
        })
    }
}

export default checkAuth;