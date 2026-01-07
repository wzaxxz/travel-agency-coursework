import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userEmail: {
            type: String,
        },
        tourName: {
            type: String,
            required: true,
        },
        tourId: {
            type: String,
        },
        fullName: {
            type: String,
            required: true,
        },
        guestSize: {
            type: Number,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        bookAt: {
            type: Date,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        guests: {
            type: Array,
        },
        status: {
            type: String,
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);