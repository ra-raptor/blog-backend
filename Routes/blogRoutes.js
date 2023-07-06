import { Router } from "express";
import checkAuth from "../Middlewares/checkAuth.js";
import cookieParser from "cookie-parser";
import { createBlog,deleteBlog,updateBlog, viewBlog,blogList, likeBlog,visitBlog } from "../Controllers/blogController.js";
const router = Router()

router.use(cookieParser())
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

router.route('/').post(checkAuth, createBlog).get(blogList)

router.put('/like/:id', checkAuth, likeBlog)
router.put('/view/:id', visitBlog)

router.route('/:id').get(viewBlog).put(checkAuth, updateBlog).delete(checkAuth, deleteBlog)


export default router;