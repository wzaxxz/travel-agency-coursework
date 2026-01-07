import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        city: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        distance: {
            type: Number,
            required: true,
        },
        photo: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        originalPrice: {
            type: Number,
        },
        maxGroupSize: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            default: 1,
        },
        reviews: [
            {
                username: String,
                rating: Number,
                comment: String,
                reply: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        rating: {
            type: Number,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        startDates: {
            type: Array,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);