import express from 'express';
import {
    createBooking,
    getAllBookings,
    getBooking,
    getUserBookings,
    deleteBooking,
    updateBooking
} from '../controllers/bookingController.js';
import { verifyAdmin, verifyUser, verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createBooking);
router.get('/:id', verifyUser, getBooking);
router.get('/', verifyAdmin, getAllBookings);
router.get('/user/:id', verifyUser, getUserBookings);
router.put('/:id', verifyAdmin, updateBooking);
router.delete('/:id', verifyAdmin, deleteBooking);

export default router;