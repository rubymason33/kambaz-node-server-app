import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import EnrollmentModel from "../Enrollments/model.js";
import CourseModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CourseRoutes(app) {
    // app.get("/api/courses", async (req, res) => {
    //     const courses = await dao.findAllCourses();
    //     res.send(courses);
    // });
    app.get("/api/courses", async (req, res) => {
        const userId = req.session?.currentUser?._id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        try {
            const courses = await dao.findCoursesForEnrolledUser(userId);
            res.json(courses);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to fetch enrolled courses" });
        }
    });
    app.post("/api/courses", async (req, res) => {
        try {
            const userId = req.session?.currentUser?._id;
            const course = await dao.createCourse(req.body);
            // auto enroll faculty who can create courses
            await EnrollmentModel.create({
                _id: uuidv4(),
                user: userId,
                course: course._id,
                role: "FACULTY",
                section: "S101",
                lastActivity: new Date(),
                totalActivity: "00:00:00"
            });

            res.json(course);
        } catch (error) {
            console.error("Failed to create course and enroll faculty:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    app.delete("/api/courses/:courseId",async (req, res) => {
        const { courseId } = req.params;
        const status = await dao.deleteCourse(courseId);
        res.send(status);
    });
    app.put("/api/courses/:courseId", async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    });
    app.get("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    });
    app.post("/api/courses/:courseId/modules", async (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = await modulesDao.createModule(module);
        res.send(newModule);
    });
    // app.get("/api/courses/:courseId/home", (req, res) => {
    //     const { courseId } = req.params;
    //     const userId = req.session?.currentUser?._id;
    //     if (!userId) {
    //         return res.status(401).json({ message: "Not authenticated" });
    //     }
    //     const isEnrolled = db.enrollments.some(
    //         (e) => e.user === userId && e.course === courseId
    //     );
    //     if (!isEnrolled) {
    //         return res.status(403).json({ message: "Access denied" });
    //     }
    //     const course = db.courses.find(c => c._id === courseId);
    //     if (!course) {
    //         return res.status(404).json({ message: "Course not found" });
    //     }
    //     res.json(course);
    // });

    app.get("/api/courses/:courseId/home", async (req, res) => {
        const { courseId } = req.params;
        const userId = req.session?.currentUser?._id;
        if (!userId) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        try {
            const isEnrolled = await EnrollmentModel.exists({ user: userId, course: courseId });
            if (!isEnrolled) {
                return res.status(403).json({ message: "Access denied" });
            }
            const course = await CourseModel.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            res.json(course);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    });
}

