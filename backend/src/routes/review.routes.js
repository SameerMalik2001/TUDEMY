import { Router } from "express";
import { createReview ,fetchByCourseId, deleteReivew, updateReview } from "../controller/review.controllers.js";
import {verifyJWT} from '../middleware/auth.middleware.js'

const reviewRouter = Router();

reviewRouter.route("/:courseId/createReview").post(verifyJWT ,createReview);
reviewRouter.route("/:courseId/fetchCourses").put(verifyJWT, fetchByCourseId);
reviewRouter.route("/:reviewId/delete").delete(verifyJWT, deleteReivew);
reviewRouter.route("/:reviewId/update").put(verifyJWT, updateReview);



export { reviewRouter };
