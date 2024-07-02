import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import { Wishlist } from "../models/wishlist.models.js";
import { Course } from "../models/course.models.js";
import { Cart } from "../models/cart.models.js";
import { ObjectId } from "mongodb";

const createWishlist = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;
  console.log("createCart");
  if(([null, undefined, ""].includes(userId) === -1) || ([null, undefined, ""].includes(courseId) === -1)) {
    throw new ApiError(401, "data is required");
  }

  // checking if user is valid
  const U = await User.findById(userId);
  if (!U) {
    throw new ApiError(401, "user not found");
  }
  // checking if course is valid
  const C = await Course.findById(courseId);
  if (!C) {
    throw new ApiError(402, "course not found");
  }
  // check wishlist is present or not
  const wishlistex = await Wishlist.findOne({userId: userId, courseId: courseId});
  if(wishlistex) {
    throw new ApiError(403, "wishlist already exists");
  }

  //check if cart present
  const cartfound = await Cart.findOne({userId, courseId});
  if(cartfound) {
    await Cart.findOneAndDelete({userId: userId, courseId:courseId})
  }

  // creating wishlist
  const wishlist = await Wishlist.create({
    userId: userId,
    courseId: courseId
  })

  res.status(200).json(
    new ApiResponse(200, wishlist, "Wishlist created successfully")
  )
})



const deleteWishlist = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;
  console.log("deleteWishlist");
  console.log(userId, courseId);
  if([null, undefined, ""].includes(courseId) === -1 || [null, undefined, ""].includes(userId) === -1) {
    throw new ApiError(401, "data is required");
  }
  
  // check for existance of cart
  const wishlistex = await Wishlist.findOne({userId: userId, courseId: courseId});
  if(!wishlistex) {
    throw new ApiError(401, "wishlist not found");
  }

  // deleting wishlist
  const wishlist = await Wishlist.findByIdAndDelete(wishlistex._id)
  if(!wishlist) {
    throw new ApiError(401, "wishlist deletion failed");
  }

  res.status(200).json(
    new ApiResponse(200, wishlist, "cart deleted successfully")
  )
})



const fetchWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log("fetchCart");
  if ([null, undefined, ""].includes(userId) === -1) {
    throw new ApiError(401, "userId is required");
  }

  // checking if user is valid
  const U = await User.findById(userId);
  if (!U) {
    throw new ApiError(401, "user not found");
  }

  //fetching carts with courses using aggregation
  const wishcart = await Wishlist.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "course"
      }
    },
    {
      $match: {
        userId: ObjectId.createFromHexString(userId)
      }
    }
  ])

  res.status(200).json(
    new ApiResponse(200, wishcart, "carts fetched successfully")
  )
  
})


const wishlistPresentOrNot = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;
  console.log("wishlistPresentOrNot");
  const wishlist = await Wishlist.findOne({ userId: userId, courseId: courseId})
  if(wishlist?._id !== undefined) {
    return res.status(200).json(
      new ApiResponse(200, true, "wishlist present")
    )
  }

  return res.status(200).json(
    new ApiResponse(200, false, "wishlist not present")
  )  
})

export { createWishlist, fetchWishlist, deleteWishlist, wishlistPresentOrNot }