import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from '../utils/AsyncHandler.js';
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next)=>{
  try {
    console.log(req?.cookies)
    const token = req.cookies?.accessToken
    // console.log(req.cookies?.accessToken + " in cookies")
    // console.log(req.header("Authorization"), "in auth");
    console.log(token + " in token")
    if(!token){
      throw new ApiError(401, "unauthorized requestss!");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
    if(!user) {
      // TODO: discussion about frontend
      throw new ApiError(401, "invalid access token!")
    }
  
    req.user = user
    req.token1 = token
    next()

  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token")
  }
})