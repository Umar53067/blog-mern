import express from 'express';
import { getAllUsers, deleteUser, getProfile } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);
router.get('/profile/:id', getProfile);
export default router;
