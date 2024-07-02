import { Router } from "express";
import { createCourse, fetchCoursesById, deleteCourseById, searchCourses, createCourseByDraft,fetchCoursesById2, fetchingUserOwnCourses, fetchAllCourses, fetchPurchasedCourses, updateCourse, updateThumbnail, updateInstructorImage, filterFetching } from "../controller/course.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import {verifyJWT} from '../middleware/auth.middleware.js'

const courseRouter = Router();

courseRouter.route("/createCourse").post( upload.fields([
    { name: "instructor_image_url", maxCount: 1 },
    { name: "thumbnail_url", maxCount: 1 }]) , createCourse);
courseRouter.route('/createCourseByDraft').post(verifyJWT, createCourseByDraft)
courseRouter.route("/fetchUserOwnCourse").put(verifyJWT, fetchingUserOwnCourses)
courseRouter.route("/PurchasedCourses").put(verifyJWT, fetchPurchasedCourses)
courseRouter.route("/:courseId/deleteCourse").delete(verifyJWT, deleteCourseById)
courseRouter.route("/:courseId/updateCourse").put(verifyJWT, updateCourse)
courseRouter.route("/:search/searchCourse").get(searchCourses)
courseRouter.route("/:courseId").put(verifyJWT, fetchCoursesById)
courseRouter.route("/:courseId/for/LogoutUser").get(fetchCoursesById2)
courseRouter.route("/").get(fetchAllCourses)
courseRouter.route("/:courseId/updateThumbnail").put(verifyJWT, upload.fields([
    {name: "thumbnail_url", maxCount: 1}
]), updateThumbnail)
courseRouter.route("/:courseId/updateInstructorImage").put(verifyJWT, upload.fields([
    {name: "instructor_image_url", maxCount: 1}
]), updateInstructorImage)
courseRouter.route("/filterFetching/:filter").post(filterFetching)


export { courseRouter };