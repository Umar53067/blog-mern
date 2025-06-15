import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser
} from '../controllers/blog.controller.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/user', getPostsByUser);
router.get('/:id', getPostById);
router.post('/', authMiddleware, upload.single('image'), createPost);
router.put('/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
