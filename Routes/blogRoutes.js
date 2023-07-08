import { Router } from "express";
import checkAuth from "../Middlewares/checkAuth.js";
import cookieParser from "cookie-parser";
import { createBlog,deleteBlog,updateBlog, viewBlog,blogList, likeBlog,visitBlog } from "../Controllers/blogController.js";
const router = Router()
import cors from 'cors'
router.use(cookieParser())
router.use(cors({
    origin: ['https://shayrana.netlify.app', 'http://localhost:3000'],
    credentials: true
  }));

router.route('/').post(checkAuth, createBlog).get(blogList)

router.put('/like/:id', checkAuth, likeBlog)
router.put('/view/:id', visitBlog)

router.route('/:id').get(viewBlog).put( updateBlog).delete( deleteBlog)


export default router;