import model from "./model.js";
import EnrollmentModel from "../Enrollments/model.js";
import { v4 as uuidv4 } from "uuid";

export function findAllCourses() {
    return model.find();
}
export async function findCoursesForEnrolledUser(userId) {
    const enrollments = await EnrollmentModel.find({ user: userId });
    const courseIds = enrollments.map((e) => e.course);
    return model.find({ _id: { $in: courseIds } });
}
export async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
}
// handle enrollments in the course of deletion
export async function deleteCourse(courseId) {
    await EnrollmentModel.deleteMany({ course: courseId });
    return model.deleteOne({ _id: courseId });
}
export async function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}

// export function findCoursesForEnrolledUser(userId) {
//     const { courses, enrollments } = Database;
//     const enrolledCourses = courses.filter((course) =>
//         enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
//     return enrolledCourses;
// }
// export function createCourse(course) {
//     const newCourse = { ...course, _id: uuidv4() };
//     Database.courses = [...Database.courses, newCourse];
//     return newCourse;
// }
// export function deleteCourse(courseId) {
//     const { courses, enrollments } = Database;
//     Database.courses = courses.filter((course) => course._id !== courseId);
//     Database.enrollments = enrollments.filter(
//         (enrollment) => enrollment.course !== courseId
//     );
// }
// export function updateCourse(courseId, courseUpdates) {
//     const { courses } = Database;
//     const course = courses.find((course) => course._id === courseId);
//     Object.assign(course, courseUpdates);
//     return course;
// }






