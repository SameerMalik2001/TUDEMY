import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Cart } from "../models/cart.models.js";
import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";
import { ObjectId } from "mongodb";
import { Wishlist } from "../models/wishlist.models.js";

const createCart = asyncHandler(async (req, res) => {
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
    throw new ApiError(401, "course not found");
  }
  //check if cart present
  const cartfound = await Cart.findOne({userId, courseId});
  if(cartfound) {
    throw new ApiError(401, "cart already exists");
  }

  // check wishlist is present or not
  const wishlistex = await Wishlist.findOne({userId: userId, courseId: courseId});
  if(wishlistex) {
    await Wishlist.findOneAndDelete({userId: userId, courseId:courseId})
  }

  // creating cart
  const cart = await Cart.create({
    userId: userId,
    courseId: courseId
  })

  res.status(200).json(
    new ApiResponse(200, cart, "cart created successfully")
  )
})



const deleteCart = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;
  console.log("deleteCart");
  console.log(userId, courseId);
  if([null, undefined, ""].includes(userId) === -1 || [null, undefined, ""].includes(courseId) === -1) {
    throw new ApiError(401, "data is required");
  }
  
  // check for existance of cart
  const cartex = await Cart.findOne({userId, courseId});
  if(!cartex) {
    throw new ApiError(401, "cart not found");
  }

  // deleting cart
  const cart = await Cart.findByIdAndDelete(cartex._id)
  if(!cart) {
    throw new ApiError(401, "cart deletion failed");
  }

  res.status(200).json(
    new ApiResponse(200, cart, "cart deleted successfully")
  )
})



const fetchCart = asyncHandler(async (req, res) => {
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
  const carts = await Cart.aggregate([
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

  let real_price = 0;
  let real_discount = 0;
  for(let i=0;i<carts.length;i++) {
    real_price += carts[i].course[0].price;
    real_discount += carts[i].course[0].discount;
  }

  res.status(200).json(
    new ApiResponse(200, {carts, real_price, real_discount}, "carts fetched successfully")
  )
  
})



const cartPresentOrNot = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;
  console.log("cartPresentOrNot");
  const cart = await Cart.findOne({ userId: userId, courseId: courseId})
  if(cart?._id !== undefined) {
    return res.status(200).json(
      new ApiResponse(200, true, "cart present")
    )
  }

  return res.status(200).json(
    new ApiResponse(200, false, "cart not present")
  )  
})

export { createCart, fetchCart, deleteCart, cartPresentOrNot }