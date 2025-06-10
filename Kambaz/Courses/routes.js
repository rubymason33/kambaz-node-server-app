import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import db from "../Database/index.js";

export default function CourseRoutes(app) {
    app.get("/api/courses", (req, res) => {
        const courses = dao.findAllCourses();
        res.send(courses);
    });
    app.delete("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const status = dao.deleteCourse(courseId);
        res.send(status);
    });
    app.put("/api/courses/:courseId", (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });
    app.get("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const modules = modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });
    app.post("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    });
    app.get("/api/courses/:courseId/home", (req, res) => {
        const { courseId } = req.params;
        const userId = req.session?.currentUser?._id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const isEnrolled = db.enrollments.some(
            (e) => e.user === userId && e.course === courseId
        );
        if (!isEnrolled) {
            return res.status(403).json({ message: "Access denied" });
        }
        const course = db.courses.find(c => c._id === courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    });
}

