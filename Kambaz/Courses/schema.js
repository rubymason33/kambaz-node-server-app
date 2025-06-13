import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
    _id: String,
    title: String,
    number: String,
    startDate: Date,
    endDate: Date,
    credits: Number,
    image: String,
    description: String,
    },
    { collection: "courses" }
);
export default courseSchema;

