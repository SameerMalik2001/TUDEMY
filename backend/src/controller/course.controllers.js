import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Course } from "../models/course.models.js";
import { Purchase } from "../models/purchase.model.js";
import { User } from "../models/user.models.js";
import { ObjectId } from "mongodb";
import { Vidoe} from "../models/video.models.js";
import mongoose from "mongoose";

const createCourse = asyncHandler(async (req, res) => {
  const {
    owner,
    title,
    total_time,
    level,
    category,
    no_of_lectures,
    languages,
    rating,
    price,
    discount,
    certificate,
    about_course,
    course_includes,
    instructor_name,
    instructor_profession,
    about_instructor,
    tags,
    requirements,
    learning,
    courseFor,
    description
  } = req.body;

  //data checking
  if (
    [
      owner,
      title,
      total_time,
      level,
      no_of_lectures,
      rating,
      price,
      discount,
      certificate,
      about_course,
      instructor_name,
      instructor_profession,
      about_instructor,
      tags,
      requirements,
      courseFor,
      description
    ].some((c) => ["", undefined, null].includes(c) === -1)
  ) {
    throw new ApiError(401, "fill the data");
  }

  //arrays check
  if(languages.length === 0|| category.length === 0 || course_includes.length === 0 || learning.length === 0) {
    throw new ApiError(401, "fill array the data");
  }

  // thumbnails checking
  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail_url) &&
    req.files.thumbnail_url.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail_url[0].path;
  }

  let instructorLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.instructor_image_url) &&
    req.files.instructor_image_url.length > 0
  ) {
    instructorLocalPath = req.files.instructor_image_url[0].path;
  }

  let isCourseNameExisted = await Course.findOne({
    $or: [{ title }],
  });

  if (isCourseNameExisted) {
    throw new ApiError(401, "couse name existed");
  }

  // thumbnail uploading
  const thumbnailCloudinaryUrl = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnailCloudinaryUrl) {
    throw new ApiError(401, "thumbnail uploading failed");
  }

  // instructor image uploading
  const instructorCloudinaryUrl = await uploadOnCloudinary(instructorLocalPath);
  if (!instructorCloudinaryUrl) {
    throw new ApiError(401, "thumbnail uploading failed");
  }

  // creating course
  const newCourse = await Course.create({
    owner,
    title,
    total_time,
    level,
    category,
    no_of_lectures,
    languages,
    rating,
    price,
    discount,
    certificate,
    about_course,
    course_includes,
    instructor_name,
    instructor_profession,
    about_instructor,
    learning,
    tags,
    requirements,
    courseFor,
    description,
    instructor_image_url: instructorCloudinaryUrl.url,
    thumbnail_url: thumbnailCloudinaryUrl.url,
  });

  // checking course is available
  if (!newCourse) {
    throw new ApiError(401, "couse creation failed");
  }

  // checking course is available
  let checkingCourse = await Course.findOne({
    $or: [{ title }],
  });

  if (!checkingCourse) {
    throw new ApiError(401, "course creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, checkingCourse, "course created successfully"));
});



const createCourseByDraft = asyncHandler(async(req, res)=>{
  const { _id ,
        owner ,
        title ,
        languages ,
        thumbnail_url ,
        price ,
        discount ,
        certificate ,
        about_course ,
        course_includes ,
        instructor_name ,
        instructor_profession ,
        about_instructor ,
        instructor_image_url ,
        category ,
        level ,
        tags,
        requirements ,
        learning,
        courseFor ,
        description } = req.body;

  const checkCourse = await Course.findById(_id)
  if(checkCourse) {
    console.log("updateCourseByDraft", req.body);
    const newCourse = await Course.findByIdAndUpdate(_id, {
      owner ,
      title ,
      languages ,
      thumbnail_url ,
      price ,
      discount ,
      certificate ,
      about_course ,
      course_includes ,
      instructor_name ,
      instructor_profession ,
      about_instructor ,
      instructor_image_url ,
      category ,
      level,
      courseFor,
      learning,
      tags,
      requirements,
      description
    });

    // checking course is available
    if (!newCourse) {
      throw new ApiError(401, "couse update failed");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, newCourse, "course update successfully"));
  }

  // creating course
  console.log("createCourseByDraft", req.body);
  const newCourse = await Course.create({
        _id ,
        owner ,
        title ,
        languages ,
        thumbnail_url ,
        price ,
        discount ,
        certificate ,
        about_course ,
        course_includes ,
        instructor_name ,
        instructor_profession ,
        about_instructor ,
        instructor_image_url ,
        category ,
        level,
        courseFor,
        learning,
        tags,
        requirements,
        description,
  });

  // checking course is available
  if (!newCourse) {
    throw new ApiError(401, "couse creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, newCourse, "course created successfully"));
})



const fetchingUserOwnCourses = asyncHandler(async (req, res) => {
  const userId = req.user._id
  console.log(userId, "fetching user courses");

  // check if user is valid
  if (!userId) {
    throw new ApiError(401, "user id is required");
  }
  const U = await User.findById(userId);
  if (!U) {
    throw new ApiError(401, "user not found");
  }

  const userIdObjectId = userId;

  const courses = await Course.find({
    owner : userIdObjectId
  })

  if (!courses) {
    throw new ApiError(401, "user couses fetching failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "User courses fetched successfully"));
});



const fetchAllCourses = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, await Course.find(), "courses fetched successfully")
    );
});



const fetchCoursesById = asyncHandler(async (req, res) => {
  console.log("fetchCoursesById");
    const { courseId } = req.params;
    const userId = req.user._id;
    // courseId check
    if (courseId === undefined || courseId === null || courseId === '') {
      throw new ApiError(403, "courseId is required")
    }
    // userId check
    if (userId === undefined || userId === null || userId === '') {
      throw new ApiError(403, "userId is required")
    }

    // checking user in bd
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(401, "user not found");
    }

    // checking course in bd
    let course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(401, "course not found");
    }
    let purchased = false;
    const checkPurchases = await Purchase.findOne({userId:userId, courseId:courseId})
    if(checkPurchases) {
      purchased = true;
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, {course, purchased}, "courses fetched successfully")
      );
});



const fetchCoursesById2 = asyncHandler(async (req, res) => {
  console.log("fetchCoursesById2");
    const { courseId } = req.params;
    // courseId check
    if (courseId === undefined || courseId === null || courseId === '') {
      throw new ApiError(403, "courseId is required")
    }

    // checking course in bd
    let course = await Course.findById(courseId);
    if (!course) {
      throw new ApiError(401, "course not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, {course}, "courses fetched successfully")
      );
});



const fetchPurchasedCourses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log("fetchPurchasedCourses", userId);
  const userIdObjectId = userId;

  const purchasedCourses = await Purchase.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "courseId",
        foreignField: "_id",
        as: "Course"
      }
    },
    {
      $match: { userId: userIdObjectId }
    },
    
  ])
  res.status(200).json(
    new ApiResponse(200, purchasedCourses, "purchased courses fetched successfully")
  )
})



const updateCourse = asyncHandler(async (req, res) => {
  const {courseId} = req.params;
  console.log("Course updated");

  // check if the course is present
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "course not found");
  }

  // update course
  const updateCourse = await Course.findByIdAndUpdate(courseId, req.body, { new: true })

  if(!updateCourse) {
    throw new ApiError(401, "course update failed");
  }

  return res
   .status(200)
   .json(new ApiResponse(200, updateCourse, "course updated successfully"));
})



const updateThumbnail = asyncHandler(async (req, res) => {
  const {courseId} = req.params;
  console.log("Course thumbnail updated");

  // check if the course is present
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "course not found");
  }

  // thumbnails checking
  let thumbnailLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.thumbnail_url) &&
    req.files.thumbnail_url.length > 0
  ) {
    thumbnailLocalPath = req.files.thumbnail_url[0].path;
  }

  // thumbnail uploading
  const thumbnailCloudinaryUrl = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnailCloudinaryUrl) {
    throw new ApiError(401, "thumbnail uploading failed");
  }

  // update course
  const updateCourse = await Course.findByIdAndUpdate(courseId, {thumbnail_url:thumbnailCloudinaryUrl.url}, { new: true })
  if(!updateCourse) {
    throw new ApiError(401, "course update failed");
  }

  res.status(200).json (
    new ApiResponse(200, updateCourse, "course thumbnail updated successfully")
  )

})



const updateInstructorImage = asyncHandler(async (req, res) => {
  const {courseId} = req.params;
  console.log("Course instructor image updated");
  // check if the course is present
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "course not found");
  }
  // instructor image checking
  let instructorLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.instructor_image_url) &&
    req.files.instructor_image_url.length > 0
  ) {
    instructorLocalPath = req.files.instructor_image_url[0].path;
  }

  // instructor image uploading
  const ImageCloudinaryUrl = await uploadOnCloudinary(instructorLocalPath);
  if (!ImageCloudinaryUrl) {
    throw new ApiError(401, "Image uploading failed");
  }

  // update course
  const updateCourse = await Course.findByIdAndUpdate(courseId, {instructor_image_url:ImageCloudinaryUrl.url}, { new: true })
  if(!updateCourse) {
    throw new ApiError(401, "course update failed");
  }

  res.status(200).json (
    new ApiResponse(200, updateCourse, "course instructor image updated successfully")
  )

})



const filterFetching = asyncHandler(async(req, res)=> {
  const { filter } = req.params;
  const F = JSON.parse(filter);
  let sorted_query = {}
  let query = {}
  if (F.video_duration !== null) {
    query.total_time = { $gte : parseInt(F.video_duration * 3600)};
  }
  if (F.level !== null) {
    query.level = F.level;
  } 
  if (F.price !== null && F.price === 'free') {
    query.price = 0;
  } 
  if (F.price !== null && F.price === 'paid') {
    query.price = { $gt: 0 };
  } 
  if (F.language !== null) {
    query.languages = {$in: [F.language]};
  } 
  if (F.rating !== null) {
    query.rating = { $gte: parseFloat(F.rating) };
  }
  
  // sorted work
  // ["high rated", "newest", "price low to high", "price high to low"]

  if(F.sort === "high rated") {
    sorted_query.rating = "desc";
  } else if(F.sort === "newest") {
    sorted_query.createdAt = "desc";
  } else if(F.sort === "price low to high") {
    sorted_query.price = "asc";
  } else if(F.sort === "price high to low") {
    sorted_query.price = "desc";
  }
  query.$or = [
    { tags : { $elemMatch: { $regex: F.topic.toLowerCase(), $options: 'i' }}},
    { title: { $regex: "\\b" + String(F.topic).toLowerCase() + "\\b", $options: 'i' }}
  ]



  const course = await Course.find(query).sort(sorted_query)

  res.status(200).json(
    new ApiResponse(200, course, "courses fetched successfully")
  )
})


const searchCourses = asyncHandler(async(req, res)=>{
  console.log("searchCourses");
  const { search } = req.params;
  console.log(search);
  const course = await Course.find({
    $or: [
      { tags : { $elemMatch: { $regex: search.toLowerCase(), $options: 'i' }}},
      { title: { $regex: "\\b"+String(search).toLowerCase()+"\\b", $options: 'i' }}
    ]
  })

  res.status(200).json(
    new ApiResponse(200, course, "courses fetched successfully")
  )
})



const deleteCourseById = asyncHandler(async(req, res)=>{
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(401, "course not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const videoRelatedCourse = await Vidoe.find({ courseId }).session(session);
    for (const video of videoRelatedCourse) {
      const deletedVideo = await Vidoe.findByIdAndDelete(video._id).session(session);
      if (!deletedVideo) {
        throw new Error(`Failed to delete video with _id: ${video._id}`);
      }
    }
    await session.commitTransaction();
    console.log('All videos deleted successfully');
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction aborted due to error:', error);
  } finally {
    session.endSession();
  }

  const deleteCourse = await Course.findByIdAndDelete(courseId);
  if(!deleteCourse) {
    throw new ApiError(401, "course delete failed");
  }

  res.status(200).json(
    new ApiResponse(200, deleteCourse, "course deleted successfully")
  )
})

export { deleteCourseById, filterFetching, searchCourses, createCourseByDraft, fetchCoursesById2, createCourse, fetchingUserOwnCourses, fetchCoursesById, fetchAllCourses, fetchPurchasedCourses, updateCourse, updateThumbnail, updateInstructorImage };
