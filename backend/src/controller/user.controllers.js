import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import {Cart} from "../models/cart.models.js";
import {Course} from "../models/course.models.js";
import {Purchase} from "../models/purchase.model.js";
import {Review} from "../models/review.models.js";
import {Vidoe} from "../models/video.models.js";
import {Wishlist} from "../models/wishlist.models.js";
import jwt from 'jsonwebtoken'
import {ObjectId} from 'mongodb'
import mongoose from "mongoose";
import {CourseDraft} from '../models/courseDraft.model.js'

const generateAccessAndRefreshToken = async (userId) => {
  try {

    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch {
    throw new ApiError(500, "something went wrong while generating refresh and access token")
  }
}



const registerUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  const isUserNamePresent = await User.findOne({
    $or: [{ username }],
  });
  if (isUserNamePresent) {
    res.status(401).send("User present already")
  }

  const isMainPresent = await User.findOne({
    $or: [{ email }],
  });
  console.log(isMainPresent);
  if (isMainPresent) {
    res.status(401).send("E-Mail present already");
  }

  const newUser = await User.create({
    username: username,
    email: email,
    password: password,
  });

  const createdUser = await User.findById(newUser._id).select("-password");

  if (!createdUser) {
    res.status(402).send("something went wrong while registering the user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Register Successfully!"));
});



const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // res.setHeader('Access-Control-Allow-Credentials', 'true');

  const user = await User.findOne({
    $or: [{ email }],
  });
  if (!user) {
    return res.status(401).send("User is not exists");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(402).send("Password is not correct");
  }


  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const dummyUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 24 * 60 * 60 * 1000 
  };

  return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(201)
    .json(new ApiResponse(200, {data:dummyUser, accessToken, refreshToken}, "User login Successfully!"));
});



const logoutUser = asyncHandler(async (req, res) => {
  console.log("logout user");
  const user  = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: ''
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    // secure: true
  }

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
  res.status(200).json(new ApiResponse(200, user, "User Logged out!"));

})



const refreshAccessToken = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  const incomingRefreshToken = await User.findById(userId)
  
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used")
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }

})



const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})


const checkCurrentPassword = asyncHandler(async (req, res) => {
  const { password } = req.body

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(password)

  if (!isPasswordCorrect) {
    return res
    .status(200)
    .json(new ApiResponse(200, {check:false}, "Password check successfully"))
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {check:true}, "Password check successfully"))
})


const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(
      200,
      req.user,
      "User fetched successfully"
    ))
})



const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body

  if (!username || !email) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        email
      }
    },
    { new: true }

  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});



const getCookies = asyncHandler(async (req, res) => {
  console.log("getCookies");
  const cookie = req.cookies;
  console.log(cookie);
  res.status(200).json(
    new ApiResponse(200, cookie, "fetched token successfully")
  )
})

const tokenValidation = asyncHandler(async (req, res) => {
  console.log("tokenValidation");
  console.log(req.user._id);
  if(!req.user._id) {
    new ApiError(404, "Invalid token")
  }
  return res.status(200).json(
    new ApiResponse(200, req.user, "token is valid")
  )
})

const deleteAccount = asyncHandler (async (req, res) => {
  const userId = req?.user?._id
  const session = await mongoose.startSession();
  session.startTransaction()

  try {
    await Course.deleteMany({ owner: userId }).session(session);
    await Purchase.deleteMany({ userId }).session(session);
    await Review.deleteMany({ userId }).session(session);
    await Vidoe.deleteMany({ userId }).session(session);
    await Wishlist.deleteMany({ userId }).session(session);
    await Cart.deleteMany({ userId }).session(session);
    await CourseDraft.deleteMany({ owner:userId }).session(session);
    await User.findByIdAndDelete(userId).session(session);
  
    await session.commitTransaction();
    session.endSession();
  
    console.log("All data deleted successfully.");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error occurred while deleting data:", error);
  }

  return res.status(200).json(
    new ApiResponse(200, "user data deleted successfully", "Account deleted successfully")
  )
})


const updateInterest = asyncHandler(async (req, res) => {
  let { topic } = req.body;
  if(topic === undefined) 
    return res.status(400).json(new ApiResponse(400, {}, "Topic is undefined"));
  if(String(topic).indexOf(' ') !== -1) {
    topic = String(topic)?.replace(/\s+/g, '_')
  }
  const dummyUser = await User.findById(req.user?._id);
  let inte = dummyUser?.interest || {}; // Initialize inte with an empty object if it's undefined
  
  if (!(topic in inte)) {
    inte[topic] = 1;
    console.log("nahi tha");
  } else {
    inte[topic] += 1;
    console.log("usme tha");
  }

  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: {
        interest: inte
      }
    },
    { new: true }
  );

  res.status(200).json(
    new ApiResponse(200, { user, inte }, "Interest updated successfully")
  );
});


const updateProfessionalInfo = asyncHandler(async(req, res) =>{
  const {profession, about} = req.body;
  if([undefined, null, ''].includes(profession) || [undefined, null, ''].includes(about)) {
    throw new ApiError(403, "invalid profile information")
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: req.body
    },
    { new: true }
  );
  if(!user) {
    throw new ApiError(404, "user updation failed")
  }

  return res.status(200).json(
    new ApiResponse(200, user, "Professional information updated successfully")
  )
})


export { updateProfessionalInfo, getCookies,deleteAccount, updateInterest,checkCurrentPassword, tokenValidation, registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails };
