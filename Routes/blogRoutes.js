import { Router } from "express";
import checkAuth from "../Middlewares/checkAuth.js";
import cookieParser from "cookie-parser";
import { createBlog,deleteBlog,updateBlog, viewBlog,blogList, likeBlog,visitBlog } from "../Controllers/blogController.js";
const router = Router()

router.use(cookieParser())


router.route('/').post(checkAuth, createBlog).get(blogList)

router.put('/like/:id', checkAuth, likeBlog)
router.put('/view/:id', visitBlog)

router.route('/:id').get(viewBlog).put(checkAuth, updateBlog).delete(checkAuth, deleteBlog)


export default router;