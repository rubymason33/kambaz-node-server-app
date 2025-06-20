import * as enrollmentsDao from "./dao.js";
import db from "../Database/index.js";

export default function EnrollmentRoutes(app) {
    app.get("/api/users/:userId/enrollments", (req, res) => {
        const { userId } = req.params;
        const enrollments = enrollmentsDao.findEnrollmentsByUser(userId);
        res.json(enrollments);
    });

    app.post("/api/courses/:courseId/enroll", (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({ error: "Missing userId or courseId" });
        }
        const newEnrollment = enrollmentsDao.enrollUserInCourse(userId, courseId);
        res.status(201).json(newEnrollment);
    });

    app.delete("/api/courses/:courseId/unenroll", (req, res) => {
        const { courseId } = req.params;
        const { userId } = req.body;
        if (!userId || !courseId) {
            return res.status(400).json({ error: "Missing userId or courseId" });
        }
        enrollmentsDao.unenrollUserFromCourse(userId, courseId);
        res.sendStatus(200);
    });

    app.get("/api/courses/users/:userId/enrollments", (req, res) => {
        const { userId } = req.params;
        const userEnrollments = db.enrollments.filter(e => e.user === userId);
        const courseIds = userEnrollments.map(e => e.course);
        const userCourses = db.courses.filter(c => courseIds.includes(c._id));
        res.json(userCourses);
    });

}
