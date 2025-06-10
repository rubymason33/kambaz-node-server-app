import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {
    const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
    const { enrollments } = db;
    db.enrollments = enrollments.filter(
        (e) => !(e.user === userId && e.course === courseId)
    );
}

export function findEnrollmentsByUser(userId) {
    const { enrollments } = db;
    return enrollments.filter((e) => e.user === userId);
}

