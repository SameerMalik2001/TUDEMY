import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Course } from "../models/course.models.js";
import { CourseDraft } from "../models/courseDraft.model.js";
import { User } from "../models/user.models.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const createCourse = async (userId) => {
  console.log(userId, "userID");
  const response = await CourseDraft.create({ owner: userId });
  console.log(response);
  console.log(response?._id, "in createCourse");
  return response?._id;
};

const uploadInstructorImage = asyncHandler(async (req, res) => {
  const { courseDraftId } = req.body;
  console.log("createInstructorImage");

  let newCourseDraftId = null;
  if (
    courseDraftId === null ||
    courseDraftId === undefined ||
    req?.user?._id !== undefined
  ) {
    newCourseDraftId = await createCourse(req?.user?._id);
  } else {
    newCourseDraftId = courseDraftId;
  }

  let instructorLocalPath = null;
  if (
    req.files &&
    Array.isArray(req.files.instructor_image_url) &&
    req.files.instructor_image_url.length > 0
  ) {
    instructorLocalPath = req.files.instructor_image_url[0].path;
  }

  let instructor = null;
  if (instructorLocalPath !== null) {
    instructor = await uploadOnCloudinary(instructorLocalPath);
    if (!instructor) {
      throw new ApiError(403, "instructor file uploadation failed");
    }
  }

  console.log(newCourseDraftId, "course ID");

  const courseDraft = await CourseDraft.findByIdAndUpdate(
    newCourseDraftId,
    {
      $set: {
        instructor_image_url: instructor.url,
      },
    },
    { new: true }
  )

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        courseDraft,
        "instructor image upload success in draft!"
      )
    );
});


const uploadThumbnailImage = asyncHandler(async (req, res) => {
  const { courseDraftId, thumbnailURL } = req.body;
  console.log("uploadThumbnailImage", thumbnailURL, courseDraftId);

  let newCourseDraftId = null;
  if (
    courseDraftId === null ||
    courseDraftId === undefined
  ) {
    newCourseDraftId = await createCourse(req?.user?._id);
  } else {
    newCourseDraftId = courseDraftId;
  }

  let thumbnailLocalPath = null;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail_image_url) &&
    req.files.thumbnail_image_url.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail_image_url[0].path;
  }
  console.log(thumbnailLocalPath, req.files);

  if(thumbnailLocalPath === null && thumbnailURL === '') {
    const courseDraft = await CourseDraft.findByIdAndUpdate(
      newCourseDraftId,
      {
        $set: {
          thumbnail_url: '',
        },
      },
      { new: true }
    )
    if(!courseDraft) {
      throw new ApiError(401, "course update failed");
    }
    return res.status(200).json(
      new ApiResponse(200, courseDraft, "thumbnail updated successfully")
    )
  }

  let thumbnail = null;
  if (thumbnailLocalPath !== null) {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
      throw new ApiError(403, "instructor file uploadation failed");
    }
  } else {
    throw new ApiError(403, "thumbnail file uploadation failed");
  }

  console.log(newCourseDraftId, "course ID");

  const courseDraft = await CourseDraft.findByIdAndUpdate(
    newCourseDraftId,
    {
      $set: {
        thumbnail_url: thumbnail.url,
      },
    },
    { new: true }
  )

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        courseDraft,
        "instructor image upload success in draft!"
      )
    );
});


const updateTextData = asyncHandler(async (req, res) => {
  const { courseDraftId } = req.body;
  console.log("updateTitle");
  console.log(req.body);

  let newCourseDraftId = null;
  if (
    courseDraftId === null ||
    courseDraftId === undefined
  ) {
    newCourseDraftId = await createCourse(req?.user?._id);
  } else {
    newCourseDraftId = courseDraftId;
  }

  // check for title is present in course db or not
  if(req.body?.title?.length !== undefined && req.body?.title.length > 0) {
    const checkTitle = await Course.findOne({title: req.body.title});
    console.log(req.body.title, checkTitle)
    if (checkTitle) {
      if(checkTitle._id === ObjectId.createFromHexString(courseDraftId)){
        throw new ApiError(401, "course Title already present");
      }
    }
  }


  const courseDraft = await CourseDraft.findByIdAndUpdate(
    newCourseDraftId,
    {
      $set: req.body
    },
    { new: true }
  )

  if(!courseDraft) {
    throw new ApiError(500, "something went wrong while updating title");
  }

  res
   .status(200)
   .json(
      new ApiResponse(
        200,
        courseDraft,
        "title update success in draft!"
      )
    );
})


const fetchAllDrafts = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      await CourseDraft.find({ owner: req?.user?._id }),
      "drafts fetched successfully"
    )
  )
})

const fetchById = asyncHandler(async (req, res) => {
  const { courseDraftId } = req.body;
  console.log("fetchById", courseDraftId);
  const checkInCourse = await Course.findById(courseDraftId);
  if(checkInCourse) {
    res.status(200).json(
      new ApiResponse(
        200,
        {courseDraft: await CourseDraft.findById(courseDraftId), update:true},
        "drafts fetched successfully"
      )
    )
  }
  res.status(200).json(
    new ApiResponse(
      200,
      {courseDraft: await CourseDraft.findById(courseDraftId), update:false},
      "drafts fetched successfully"
    )
  )
})

export { uploadInstructorImage , uploadThumbnailImage, updateTextData,fetchAllDrafts,fetchById
};
