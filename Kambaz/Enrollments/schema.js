import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
    _id: String,
    user: String,
    course: String,
    role: String,
    section: String,
    lastActivity: Date,
    totalActivity: String,
    },
    { collection: "enrollments" }
);
export default enrollmentSchema;

