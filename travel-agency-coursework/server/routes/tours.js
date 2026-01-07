import express from 'express';
import Tour from '../models/Tour.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const newTour = new Tour(req.body);
    try {
        const savedTour = await newTour.save();
        res.status(200).json({ success: true, message: "Тур успішно створено", data: savedTour });
    } catch (err) {
        res.status(500).json({ success: false, message: "Не вдалося створити тур" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Тур оновлено", data: updatedTour });
    } catch (err) {
        res.status(500).json({ success: false, message: "Не вдалося оновити" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Тур видалено" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Не вдалося видалити" });
    }
});

router.get("/search/getTourBySearch", async (req, res) => {

    const city = new RegExp(req.query.city, 'i');

    try {
        const tours = await Tour.find({ city });

        res.status(200).json({
            success: true,
            message: "Successful",
            data: tours,
        });
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "not found",
        });
    }
});

router.get('/search/getFeaturedTours', async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true }).limit(8);
        res.status(200).json({ success: true, count: tours.length, data: tours });
    } catch (err) {
        res.status(500).json({ success: false, message: "Помилка отримання" });
    }
});

router.get('/search/getTourCount', async (req, res) => {
    try {
        const tourCount = await Tour.estimatedDocumentCount();
        res.status(200).json({ success: true, data: tourCount });
    } catch (err) {
        res.status(500).json({ success: false, message: "Помилка" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id).populate('reviews');
        res.status(200).json({ success: true, message: "Успішно", data: tour });
    } catch (err) {
        res.status(404).json({ success: false, message: "Тур не знайдено" });
    }
});

router.get('/', async (req, res) => {
    const { city, minPrice, maxPrice, featured } = req.query;

    try {
        let query = {};

        if (city) {
            query.city = { $regex: city, $options: "i" };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (featured) {
            query.featured = true;
        }

        const tours = await Tour.find(query).populate('reviews');
        res.status(200).json({ success: true, count: tours.length, data: tours });
    } catch (err) {
        res.status(500).json({ success: false, message: "Помилка пошуку" });
    }
});

router.post('/:id/reviews', async (req, res) => {
    const tourId = req.params.id;
    const { username, rating, comment } = req.body;

    try {
        const tour = await Tour.findById(tourId);

        if (!tour) {
            return res.status(404).json({ message: "Тур не знайдено" });
        }

        if (!tour.reviews) {
            tour.reviews = [];
        }

        const newReview = { username, rating, comment, createdAt: new Date() };
        tour.reviews.push(newReview);

        const totalRating = tour.reviews.reduce((acc, item) => acc + Number(item.rating), 0);
        tour.rating = (totalRating / tour.reviews.length).toFixed(1);

        await tour.save();

        res.status(200).json({ success: true, message: "Відгук додано", data: tour });
    } catch (err) {
        console.error("Помилка при додаванні відгуку:", err);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

router.put('/:id/reviews/:reviewId/reply', async (req, res) => {
    const { id, reviewId } = req.params;
    const { replyText } = req.body;

    try {
        const tour = await Tour.findOneAndUpdate(
            { _id: id, "reviews._id": reviewId },
            { $set: { "reviews.$.reply": replyText } },
            { new: true }
        );

        if (!tour) {
            return res.status(404).json({ message: "Тур або відгук не знайдено" });
        }

        res.status(200).json({ success: true, message: "Відповідь додано", data: tour });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Помилка відповіді" });
    }
});

export default router;