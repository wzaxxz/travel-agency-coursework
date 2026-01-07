import express from 'express';
import {
    deleteUser,
    getAllUser,
    getSingleUser,
    updateUser,
    toggleFavorite
} from '../controllers/userController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

router.put('/:id', verifyUser, updateUser);
router.delete('/:id', verifyUser, deleteUser);
router.get('/:id', verifyUser, getSingleUser);
router.get('/', verifyAdmin, getAllUser);
router.put('/:id/favorites', verifyUser, toggleFavorite);

export default router;