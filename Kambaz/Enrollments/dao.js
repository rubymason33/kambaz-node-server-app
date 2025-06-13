import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// export function enrollUserInCourse(userId, courseId) {
//     const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
//     db.enrollments = [...db.enrollments, newEnrollment];
//     return newEnrollment;
// }

// export function unenrollUserFromCourse(userId, courseId) {
//     const { enrollments } = db;
//     db.enrollments = enrollments.filter(
//         (e) => !(e.user === userId && e.course === courseId)
//     );
// }

// export function findEnrollmentsByUser(userId) {
//     const { enrollments } = db;
//     return enrollments.filter((e) => e.user === userId);
// }
export async function enrollUserInCourse(userId, courseId) {
    const newEnrollment = await model.create({
        _id: uuidv4(),
        user: userId,
        course: courseId,
        role: "STUDENT",
        section: "S101",
        lastActivity: new Date(),
        totalActivity: "00:00:00"
    });
    return newEnrollment;
}

export async function unenrollUserFromCourse(userId, courseId) {
    await model.deleteOne({ user: userId, course: courseId });
}

export async function findEnrollmentsByUser(userId) {
    return model.find({ user: userId });
}



