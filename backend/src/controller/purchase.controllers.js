import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";

const createPurchase = asyncHandler(async (req, res) => {
    const {courseId} = req.params;
    const userId = req.user._id;


    //checking data
    if ([courseId, userId].some(x => x === undefined || x === null || x === '')) {
        throw new ApiError(401, "fill the data");
    }

    //checking course is available
    let checkingCourse = await Course.findById(courseId)
    if (!checkingCourse) {
        throw new ApiError(401, "course not found");
    }

    //checking the userId is available
    let checkingUser = await User.findById(userId)
    if (!checkingUser) {
        throw new ApiError(401, "user not found");
    }

    // checking if the user is already in the course purchase db
    let isPurchased = await Purchase.findOne({userId, courseId})
    if (isPurchased) {
        return res.status(401).send("user already purchased this course")
    }

    const purchase = await Purchase.create({
        userId,
        courseId
    })
    if (!purchase) {
        throw new ApiError(500, "something went wrong while purchasing the course!")
    }

    //fetching the purchase data
    const fetchedPurchase = await Purchase.findById(purchase._id)
    if (!fetchedPurchase) {
        throw new ApiError(500, "something went wrong while purchasing the course!")
    }


    return res.status(201).json(
        new ApiResponse(
            200,
            fetchedPurchase,
            "course purchased successfully"
        )
    )
})



const studentCount = asyncHandler(async (req, res) => {
    const {courseId} = req.params;
    return res.status(200).json(
        new ApiResponse(
            200,
            await Purchase.countDocuments({courseId}),
            "student count"
        )
    )
})

export { createPurchase, studentCount }
