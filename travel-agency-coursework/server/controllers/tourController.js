import Tour from '../models/Tour.js';

export const createTour = async (req, res) => {
    const newTour = new Tour(req.body);

    try {
        const savedTour = await newTour.save();
        res.status(200).json({
            success: true,
            message: "Successfully created",
            data: savedTour
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create. Try again" });
    }
};

export const updateTour = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedTour
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update" });
    }
};

export const deleteTour = async (req, res) => {
    const id = req.params.id;
    try {
        await Tour.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Successfully deleted"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete" });
    }
};

export const getSingleTour = async (req, res) => {
    const id = req.params.id;
    try {
        const tour = await Tour.findById(id).populate("reviews");
        res.status(200).json({
            success: true,
            message: "Successfully found",
            data: tour
        });
    } catch (err) {
        res.status(404).json({ success: false, message: "Not found" });
    }
};

export const getAllTours = async (req, res) => {
    // Пагінація
    const page = parseInt(req.query.page);

    try {
        const tours = await Tour.find({})
            .populate("reviews")
            .skip(page * 8)
            .limit(8);

        res.status(200).json({
            success: true,
            count: tours.length,
            message: "Successfully found",
            data: tours
        });
    } catch (err) {
        res.status(404).json({ success: false, message: "Not found" });
    }
};

export const getTourBySearch = async (req, res) => {
    // "i" означає case insensitive (нечутливий до регістру)
    const city = new RegExp(req.query.city, 'i');

    try {
        const tours = await Tour.find({ city });

        res.status(200).json({
            success: true,
            message: "Successfully found",
            data: tours
        });
    } catch (err) {
        res.status(404).json({ success: false, message: "Not found" });
    }
};

export const getFeaturedTours = async (req, res) => {
    try {
        const tours = await Tour.find({ featured: true })
            .populate("reviews")
            .limit(8);

        res.status(200).json({
            success: true,
            message: "Successful",
            data: tours
        });
    } catch (err) {
        res.status(404).json({ success: false, message: "Not found" });
    }
};

export const getTourCount = async (req, res) => {
    try {
        const tourCount = await Tour.estimatedDocumentCount();
        res.status(200).json({ success: true, data: tourCount });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch" });
    }
};