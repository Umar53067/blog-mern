import express from 'express';
import { createComment, getCommentsByBlog } from '../controllers/comment.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createComment);
router.get('/:blogId', getCommentsByBlog);

export default router;
