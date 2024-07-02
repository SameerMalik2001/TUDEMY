import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Vidoe } from "../models/video.models.js";
import { Course } from "../models/course.models.js";
import { Purchase } from "../models/purchase.model.js";
import { CourseDraft } from "../models/courseDraft.model.js";
import { ObjectId } from 'mongodb';

const uploadVideo = asyncHandler(async (req, res) => {
  const {
    description,
    video_length,
    section,
    section_title,
    lecture,
    lecture_title,
  } = req.body;
  const { courseId } = req.params;

  //checking data
  if (
    [
      description,
      video_length,
      section,
      section_title,
      lecture,
      lecture_title,
    ].some((x) => x === undefined || x === null || x === "")
  ) {
    throw new ApiError(403, "Upload all video data is required");
  }

  // checking video files
  let video_url = null;
  if (
    req.files &&
    Array.isArray(req.files.video) &&
    req.files.video.length > 0
  ) {
    video_url = req.files.video[0].path;
  } else {
    throw new ApiError(403, "video files required");
  }

  // uplaod vidoe on cloudinary
  const video = await uploadOnCloudinary(video_url);
  if (!video) {
    throw new ApiError(403, "video files uploadation failed");
  }

  // create video
  const newVideo = await Vidoe.create({
    description: description,
    video_length: video_length,
    video_url: video.url,
    courseId: courseId,
    section,
    section_title,
    lecture,
    lecture_title,
  });

  // check if video created successfully
  if (!newVideo) {
    throw new ApiError(500, "something went wrong while uploading the video!");
  }

  // fetching vidoe
  const fetchedVideo = await Vidoe.findById(newVideo._id);

  if (!fetchedVideo) {
    throw new ApiError(500, "something went wrong while uploading the video!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, fetchedVideo, "Video uploaded successfully!"));
});

const fetchAllVideosByCourseId = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  //checking data
  if (courseId === undefined || courseId === null || courseId === "") {
    throw new ApiError(403, "courseId is required");
  }

  if(!ObjectId.isValid(courseId)) {
    throw new ApiError(403, "courseId is invalid");
  }

  // checking course in bd
  const checkingCourse = await CourseDraft.findById(ObjectId.createFromHexString(courseId));
  if (!checkingCourse) {
    throw new ApiError(403, "courseId is invalid");
  }

  // confirm that you have purchased this course 
  const purchasedCourse = await Purchase.findOne({ courseId: ObjectId.createFromHexString(courseId), userId: req.user.id });
  if (!purchasedCourse) {
    throw new ApiError(690, "you have not purchased this course");
  }

  const videos = await Vidoe.find({ courseId: ObjectId.createFromHexString(courseId) });
  if (!videos) {
    throw new ApiError(500, "something went wrong while fetching the videos!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully!"));
});

const fetchAllVideosByCourseIdLogout = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  //checking data
  if (courseId === undefined || courseId === null || courseId === "") {
    throw new ApiError(403, "courseId is required");
  }

  // checking course in bd
  const checkingCourse = await CourseDraft.findById(ObjectId.createFromHexString(courseId));
  if (!checkingCourse) {
    throw new ApiError(403, "courseId is invalid");
  }

  const videos = await Vidoe.find({ courseId: ObjectId.createFromHexString(courseId) });
  if (!videos) {
    throw new ApiError(500, "something went wrong while fetching the videos!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully!"));
});

const updateVideoBothNotNull = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  console.log(req.body, req.files);
  if (videoId === "null") {
    const {
      description,
      video_length,
      courseId,
      section,
      section_title,
      lecture,
      lecture_title,
    } = req.body;
    console.log(
      description,
      video_length,
      courseId,
      section,
      section_title,
      lecture,
      lecture_title
    );
    //checking data
    if (
      [
        description,
        video_length,
        section,
        courseId,
        section_title,
        lecture,
        lecture_title,
      ].some((x) => x === undefined || x === null || x === "")
    ) {
      throw new ApiError(403, "Upload all video data is required");
    }

    // check course present or not present
    const checkingCourse = await CourseDraft.findById(ObjectId.createFromHexString(courseId));
    if (!checkingCourse) {
      throw new ApiError(403, "courseDraftId is invalid");
    }

    // checking video  files
    let video_url = null;
    if (
      req.files &&
      Array.isArray(req.files.video) &&
      req.files.video.length > 0
    ) {
      video_url = req.files.video[0].path;
    }

    // uplaod vidoe and audio on cloudinary
    let video = { url: null };
    if (video_url !== null) {
      video = await uploadOnCloudinary(video_url);
      if (!video) {
        throw new ApiError(403, "video files uploadation failed");
      }
    }

    const increasecount = await Course.findByIdAndUpdate(
      ObjectId.createFromHexString(courseId),
      { $inc: { no_of_lectures: 1 } },
      { new: true }
    );
    if (!increasecount) {
      throw new ApiError(
        500,
        "something went wrong while increase the video count!"
      );
    }

    // create video
    const newVideo = await Vidoe.create({
      description: description,
      video_length: video_length,
      video_url: video.url,
      courseId: ObjectId.createFromHexString(courseId),
      section,
      section_title,
      lecture,
      lecture_title,
      userId: req.user._id,
      video_length,
    });

    // check if video created successfully
    if (!newVideo) {
      throw new ApiError(
        500,
        "something went wrong while uploading the video!"
      );
    }

    // fetching vidoe
    const fetchedVideo = await Vidoe.findById(newVideo._id);

    if (!fetchedVideo) {
      throw new ApiError(
        500,
        "something went wrong while uploading the video!"
      );
    }

    const result = await Vidoe.aggregate([
      {
        $match: {
          courseId: ObjectId.createFromHexString(courseId),
        },
      },
      {
        $addFields: {
          minutes: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 0] },
          seconds: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 1] },
        },
      },
      {
        $addFields: {
          total_seconds: {
            $add: [
              { $multiply: [{ $toDouble: "$minutes" }, 60] },
              { $toDouble: "$seconds" },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total_video_length: { $sum: "$total_seconds" },
        },
      },
    ]);

    // Extract the sum from the result
    const totalSum =
      result[0]?._id === null ? result[0]?.total_video_length : 0;

    const updateTotalTime = await Course.findByIdAndUpdate(ObjectId.createFromHexString(courseId), {
      $set: {
        total_time: totalSum,
      },
    });
    if (!updateTotalTime) {
      throw new ApiError(
        500,
        "something went wrong while updating the video time!"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, fetchedVideo, "Video uploaded successfully!"));
  } else if (videoId !== "null") {
    req.body.userId = req.user._id;

    // check if video exists
    const checkingVideo = await Vidoe.findById(videoId);
    if (!checkingVideo) {
      throw new ApiError(403, "videoId is invalid");
    }

    // checking video  files
    let video_url = null;
    if (
      req.files &&
      Array.isArray(req.files.video) &&
      req.files.video.length > 0
    ) {
      video_url = req.files.video[0].path;
    }

    if (video_url) {
      const video = await uploadOnCloudinary(video_url);
      if (!video) {
        throw new ApiError(403, "video file uploadation failed");
      }
      req.body.video_url = video.url;
    }

    // update video
    const updatedVideo = await Vidoe.findByIdAndUpdate(videoId, req.body, {
      new: true,
    });
    if (!updatedVideo) {
      throw new ApiError(500, "something went wrong while updating the video!");
    }

    const result = await Vidoe.aggregate([
      {
        $match: {
          courseId: checkingVideo.courseId,
        },
      },
      {
        $addFields: {
          minutes: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 0] },
          seconds: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 1] },
        },
      },
      {
        $addFields: {
          total_seconds: {
            $add: [
              { $multiply: [{ $toDouble: "$minutes" }, 60] },
              { $toDouble: "$seconds" },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          total_video_length: { $sum: "$total_seconds" },
        },
      },
    ]);

    // Extract the sum from the resultf
    const totalSum =
      result[0]?._id === null ? result[0]?.total_video_length : 0;

    console.log(
      result[0]._id,
      result[0]?.total_video_length,
      totalSum,
      checkingVideo.courseId
    );
    const updateTotalTime = await Course.findByIdAndUpdate(
      checkingVideo.courseId,
      {
        $set: {
          total_time: parseInt(totalSum),
        },
      },
      {
        new: true,
      }
    );
    if (!updateTotalTime) {
      throw new ApiError(
        500,
        "something went wrong while updating the video time!"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "Video updated successfully!"));
  }
});


const updateForVideoNullIdNotNull = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  console.log("updateForVideoNull");

  req.body.userId = req.user._id;

  // check if video exists
  const checkingVideo = await Vidoe.findById(videoId);
  if (!checkingVideo) {
    throw new ApiError(403, "videoId is invalid");
  }

  req.body.video_url = null;

  // update video
  const updatedVideo = await Vidoe.findByIdAndUpdate(videoId, req.body, {
    new: true,
  });
  if (!updatedVideo) {
    throw new ApiError(500, "something went wrong while updating the video!");
  }

  const result = await Vidoe.aggregate([
    {
      $match: {
        courseId: checkingVideo.courseId,
      },
    },
    {
      $addFields: {
        minutes: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 0] },
        seconds: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 1] },
      },
    },
    {
      $addFields: {
        total_seconds: {
          $add: [
            { $multiply: [{ $toDouble: "$minutes" }, 60] },
            { $toDouble: "$seconds" },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        total_video_length: { $sum: "$total_seconds" },
      },
    },
  ]);

  // Extract the sum from the result
  const totalSum = result[0]?._id === null ? result[0]?.total_video_length : 0;

  const updateTotalTime = await Course.findByIdAndUpdate(
    checkingVideo.courseId,
    {
      $set: {
        total_time: totalSum,
      },
    }
  );
  if (!updateTotalTime) {
    throw new ApiError(
      500,
      "something went wrong while updating the video time!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video updated successfully!"));
});


const updateForVideoNotNullIdNull = asyncHandler(async (req, res) => {
  const {
    description,
    video_length,
    section,
    section_title,
    lecture,
    lecture_title,
    courseId,
  } = req.body;

  console.log(req.body, "in updateForVideoNotNullIdNull");

  //checking data
  if (
    [
      description,
      video_length,
      section,
      section_title,
      lecture,
      lecture_title,
      courseId
    ].some((x) => x === undefined || x === null || x === "")
  ) {
    throw new ApiError(403, "Upload all video data is required");
  }

  // checking video files
  let video_url = null;
  if (
    req.files &&
    Array.isArray(req.files.video) &&
    req.files.video.length > 0
  ) {
    video_url = req.files.video[0].path;
  } else {
    throw new ApiError(403, "video files required");
  }

  // uplaod vidoe on cloudinary
  const video = await uploadOnCloudinary(video_url);
  if (!video) {
    throw new ApiError(403, "video files uploadation failed");
  }

  // create video
  const newVideo = await Vidoe.create({
    description: description,
    video_length: video_length,
    video_url: video.url,
    courseId: ObjectId.createFromHexString(courseId),
    section,
    section_title,
    lecture,
    lecture_title,
    userId: req?.user?._id
  });

  // check if video created successfully
  if (!newVideo) {
    throw new ApiError(500, "something went wrong while uploading the video!");
  }

  // fetching vidoe
  const fetchedVideo = await Vidoe.findById(newVideo._id);

  if (!fetchedVideo) {
    throw new ApiError(500, "something went wrong while uploading the video!");
  }

  const increasecount = await Course.findByIdAndUpdate(
    ObjectId.createFromHexString(courseId),
    { $inc: { no_of_lectures: 1 } },
    { new: true }
  );
  if (!increasecount) {
    throw new ApiError(
      500,
      "something went wrong while increase the video count!"
    );
  }

  const result = await Vidoe.aggregate([
    {
      $match: {
        courseId: ObjectId.createFromHexString(courseId)
      },
    },
    {
      $addFields: {
        minutes: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 0] },
        seconds: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 1] },
      },
    },
    {
      $addFields: {
        total_seconds: {
          $add: [
            { $multiply: [{ $toDouble: "$minutes" }, 60] },
            { $toDouble: "$seconds" },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        total_video_length: { $sum: "$total_seconds" },
      },
    },
  ]);

  console.log(
    result,
    result[0],
    result[0]?._id,
    result[0]?.total_video_length,
    courseId
  );

  // Extract the sum from the result
  const totalSum = result[0]?._id === null ? result[0]?.total_video_length : 0;

  console.log(totalSum);

  const updateTotalTime = await Course.findByIdAndUpdate(
    ObjectId.createFromHexString(courseId),
    {
      $set: {
        total_time: parseInt(totalSum),
      },
    },
    {
      new: true,
    }
  );
  if (!updateTotalTime) {
    throw new ApiError(
      500,
      "something went wrong while updating the video time!"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, fetchedVideo, "Video uploaded successfully!"));
})


const updateForVideoNullIdNull = asyncHandler(async (req, res) => {
  const {
    courseId,
    description,
    section,
    section_title,
    lecture,
    lecture_title,
  } = req.body;
  console.log(req.body, "in updateForVideoNullIdNull");

  // Validate courseId
  if (!ObjectId.isValid(courseId)) {
    throw new ApiError(400, "Invalid courseId format");
  }

  //checking data
  if (
    [description,courseId, section, section_title, lecture, lecture_title].some(
      (x) => x === undefined || x === null || x === ""
    )
  ) {
    throw new ApiError(403, "Upload all video data is required");
  }

  const increasecount = await Course.findByIdAndUpdate(
    ObjectId.createFromHexString(courseId),
    { $inc: { no_of_lectures: 1 } },
    { new: true }
  );
  if (!increasecount) {
    throw new ApiError(
      500,
      "something went wrong while increase the video count!"
    );
  }

  req.body.video_url = null;

  // create video
  const newVideo = await Vidoe.create({
    description: description,
    video_url: null,
    courseId: ObjectId.createFromHexString(courseId),
    userId: req.user._id,
    section,
    section_title,
    lecture,
    lecture_title,
  });

  // check if video created successfully
  if (!newVideo) {
    throw new ApiError(500, "something went wrong while uploading the video!");
  }

  // fetching vidoe
  const fetchedVideo = await Vidoe.findById(newVideo?._id);

  if (!fetchedVideo) {
    throw new ApiError(500, "something went wrong while uploading the video!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, fetchedVideo, "Video created successfully!"));
});


const deleteById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  console.log("deleteById");

  // check if video exists
  const checkingVideo = await Vidoe.findById(videoId);
  if (!checkingVideo) {
    throw new ApiError(403, "videoId is invalid");
  }

  const increasecount = await Course.findByIdAndUpdate(
    checkingVideo.courseId,
    { $inc: { no_of_lectures: -1 } },
    { new: true }
  );
  if (!increasecount) {
    throw new ApiError(
      500,
      "something went wrong while increase the video count!"
    );
  }

  // delete video
  const updatedVideo = await Vidoe.findByIdAndDelete(videoId);
  if (!updatedVideo) {
    throw new ApiError(500, "something went wrong while delete the video!");
  }

  const result = await Vidoe.aggregate([
    {
      $match: {
        courseId: checkingVideo.courseId,
      },
    },
    {
      $addFields: {
        minutes: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 0] },
        seconds: { $arrayElemAt: [{ $split: ["$video_length", ":"] }, 1] },
      },
    },
    {
      $addFields: {
        total_seconds: {
          $add: [
            { $multiply: [{ $toDouble: "$minutes" }, 60] },
            { $toDouble: "$seconds" },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        total_video_length: { $sum: "$total_seconds" },
      },
    },
  ]);

  // Extract the sum from the result
  const totalSum = result[0]?._id === null ? result[0]?.total_video_length : 0;

  const updateTotalTime = await Course.findByIdAndUpdate(
    checkingVideo.courseId,
    {
      $set: {
        total_time: totalSum,
      },
    }
  );
  if (!updateTotalTime) {
    throw new ApiError(
      500,
      "something went wrong while updating the video time!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video delete successfully!"));
});

export {
  uploadVideo,
  fetchAllVideosByCourseId,
  updateVideoBothNotNull,
  updateForVideoNullIdNotNull,
  deleteById,
  updateForVideoNullIdNull,
  updateForVideoNotNullIdNull,
  fetchAllVideosByCourseIdLogout

};
