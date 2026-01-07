import Booking from '../models/Booking.js';
import Tour from '../models/Tour.js';

export const createBooking = async (req, res) => {
    const newBooking = new Booking({
        ...req.body,
        userId: String(req.body.userId)
    });

    try {
        if (req.body.tourId) {
            const tour = await Tour.findById(req.body.tourId);
            if (tour) {
                if (req.body.guestSize > tour.maxGroupSize) {
                    return res.status(400).json({
                        success: false,
                        message: `Недостатньо місць! Залишилося лише ${tour.maxGroupSize}`
                    });
                }
                await Tour.findByIdAndUpdate(req.body.tourId, {
                    $inc: { maxGroupSize: -req.body.guestSize }
                });
            }
        }

        const savedBooking = await newBooking.save();
        console.log("✅ Бронювання створено для userId:", savedBooking.userId);

        res.status(200).json({
            success: true,
            message: "Your tour is booked!",
            data: savedBooking
        });
    } catch (err) {
        console.error("❌ Помилка створення:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getBooking = async (req, res) => {
    const id = req.params.id;
    try {
        const book = await Booking.findById(id);
        res.status(200).json({ success: true, message: "successful", data: book });
    } catch (err) {
        res.status(404).json({ success: false, message: "not found" });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const books = await Booking.find();
        res.status(200).json({ success: true, message: "successful", data: books });
    } catch (err) {
        res.status(500).json({ success: false, message: "internal server error" });
    }
};

export const getUserBookings = async (req, res) => {
    const userId = req.params.id;
    console.log(`🔎 Шукаю бронювання для юзера: [${userId}]`);

    try {
        const books = await Booking.find({ userId: userId });
        console.log(`📊 Знайдено: ${books.length} бронювань.`);

        res.status(200).json({
            success: true,
            message: "successful",
            data: books
        });
    } catch (err) {
        console.error("Помилка пошуку:", err);
        res.status(404).json({ success: false, message: "not found" });
    }
};

export const deleteBooking = async (req, res) => {
    const id = req.params.id;
    try {
        const bookingToDelete = await Booking.findById(id);

        if (!bookingToDelete) {
            return res.status(404).json({ success: false, message: "Бронювання не знайдено" });
        }

        if (bookingToDelete.tourId && bookingToDelete.status !== 'cancelled') {
            await Tour.findByIdAndUpdate(bookingToDelete.tourId, {
                $inc: { maxGroupSize: bookingToDelete.guestSize } // Додаємо назад (+)
            });
            console.log(`♻️ Повернуто ${bookingToDelete.guestSize} місць до туру ${bookingToDelete.tourId}`);
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Successfully deleted and spots restored" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete" });
    }
};

export const updateBooking = async (req, res) => {
    const id = req.params.id;
    try {
        const oldBooking = await Booking.findById(id);
        if (!oldBooking) return res.status(404).json({message: "Not found"});

        if (req.body.status === 'cancelled' && oldBooking.status !== 'cancelled') {
            if (oldBooking.tourId) {
                await Tour.findByIdAndUpdate(oldBooking.tourId, {
                    $inc: { maxGroupSize: oldBooking.guestSize } // Додаємо місця (+)
                });
                console.log(`♻️ Статус "cancelled": повернуто ${oldBooking.guestSize} місць`);
            }
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Successfully updated", data: updatedBooking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update" });
    }
};