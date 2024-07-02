import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Review} from "../models/review.models.js"
import {User} from "../models/user.models.js"
import {Course} from "../models/course.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { ObjectId } from "mongodb";


const createReview = asyncHandler( async (req, res)=> {
  const {courseId} = req.params;
  const {star, text} = req.body;
  const userId = req.user._id;

  if([undefined, null, ""].indexOf(userId) !== -1 || [undefined, null, ""].indexOf(courseId) !== -1
  || [undefined, null, ""].indexOf(star) !== -1 || [undefined, null, ""].indexOf(text) !== -1) {
    throw new ApiError(401, "fill data");
  }

  // check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "user not found");
  }

  // check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "course not found");
  }

  // check if review already exists
  const review = await Review.findOne({userId, courseId});
  if (review) {
    throw new ApiError(401, "review already exists");
  }

  const newReview = await Review.create({userId, courseId, star, text});
  if (!newReview) {
    throw new ApiError(500, "something went wrong while creating review");
  }

  //fetching the review data
  const fetchedReviewData = await Review.find({courseId})
  if (!fetchedReviewData) {
    throw new ApiError(500, "something went wrong while creating review");
  }
  let a = 0;
  fetchedReviewData.map(item=>{
    a = a + item.star;
  })
  if(fetchedReviewData.length > 0) {
    a = a / fetchedReviewData.length;
  }

  const updateCourseReview = await Course.findByIdAndUpdate(
    courseId,
    {
      $set: {
        rating: a
      }
    }
  )
  if (!updateCourseReview) {
    throw new ApiError(500, "something went wrong while creating course rating");
  }

  res.status(201).json( 
    new ApiResponse(200, newReview, "successful review created")
  );

})



const fetchByCourseId = asyncHandler(async (req, res) => {
  const {courseId} = req.params;
  console.log("fetchByCourseId");

  // check if the course present
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "course not found");
  }

  // fetch all reviews
  const reviews = await Review.aggregate([
    { $match: {courseId: ObjectId.createFromHexString(courseId)}},
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: "$user"
    },
    {
      $project: {
        _id: 1,
        text: 1,
        star: 1,
        duration: {
          $dateDiff : { startDate: "$createdAt", endDate: new Date(), unit: "second"}
        },
        "user.username": 1,
      }
    }
  ])

  if (!reviews) {
    throw new ApiError(500, "something went wrong while fetching reviews");
  }

  const check = await Review.findOne({userId: req.user._id, courseId: courseId})

  if(check) {
    res.status(200).json(
      new ApiResponse(200, {reviews, check:true, yourReview: check}, "reviews fetched successfully")
    );
  }
  else {
    res.status(200).json(
      new ApiResponse(200, {reviews, check:false}, "reviews fetched successfully")
    );
  }

})



const deleteReivew = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  console.log("deleteReivew");

  // check if the review present
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(401, "review not found");
  }

  // delete the review
  const deletedReview = await Review.findByIdAndDelete(reviewId);
  if (!deletedReview) {
    throw new ApiError(500, "something went wrong while deleting review");
  }

  //fetching the review data
  const fetchedReviewData = await Review.find({courseId: review.courseId})
  if (!fetchedReviewData) {
    throw new ApiError(500, "something went wrong while creating review");
  }
  let a = 0;
  fetchedReviewData.map(item=>{
    a = a + item.star;
  })
  if(fetchedReviewData.length > 0) {
    a = a / fetchedReviewData.length;
  }

  const updateCourseReview = await Course.findByIdAndUpdate(
    review.courseId,
    {
      $set: {
        rating: a
      }
    }
  )
  if (!updateCourseReview) {
    throw new ApiError(500, "something went wrong while creating course rating");
  }

  res.status(200).json(
    new ApiResponse(200, deletedReview, "review deleted successfully")
  );


})



const updateReview = asyncHandler(async (req, res) => {
  const {reviewId} = req.params;
  console.log("updateReview");

  // check if the review present
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(401, "review not found");
  }

  // update the review
  const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, {new: true});
  if (!updatedReview) {
    throw new ApiError(500, "something went wrong while updating review");
  }

  //fetching the review data
  const fetchedReviewData = await Review.find({courseId: review.courseId})
  if (!fetchedReviewData) {
    throw new ApiError(500, "something went wrong while creating review");
  }
  let a = 0;
  fetchedReviewData.map(item=>{
    a = a + item.star;
  })
  if(fetchedReviewData.length > 0) {
    a = a / fetchedReviewData.length;
  }

  const updateCourseReview = await Course.findByIdAndUpdate(
    review.courseId,
    {
      $set: {
        rating: a
      }
    }
  )
  if (!updateCourseReview) {
    throw new ApiError(500, "something went wrong while creating course rating");
  }

  res.status(200).json(
    new ApiResponse(200, updatedReview, "review updated successfully")
  );

})



export { createReview, fetchByCourseId, deleteReivew, updateReview };