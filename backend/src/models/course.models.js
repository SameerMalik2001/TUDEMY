import mongoose from "mongoose";

const diffi = ["Beginner", "Intermediate", "Expert"]

const courseSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: Array,
      required: true,
      default: []
    },
    no_of_lectures: {
      type: Number,
      default: 0,
    },
    languages: {
      type: Array,
      required: true,
      default: [],
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    thumbnail_url: {
      type: String, //cloudinary url
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    certificate: {
      type: Boolean,
      required: true,
      default: false,
    },
    about_course: {
      type: String,
      required: true,
      trim: true,
    },
    course_includes: {
      type: Array,
      required: true,
      default: [],
    },
    instructor_name: {
      type: String,
      // required: true,
      trim: true,
    },
    instructor_profession: {
      type: String,
      // required: true,
      trim: true,
    },
    about_instructor: {
      type: String,
      // required: true,
      trim: true,
    },
    instructor_image_url: {
      type: String,
      // required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: diffi,
      required: true,
      default: "Beginner",
    },
    total_time: {
      type: Number,
      required: true,
      default: 0
    },
    learning: {
      type: Array,
      required: true,
      default: [],
    },
    tags: {
      type: Array,
      required: true,
      default: [],
    },
    requirements:{
      type: Array,
      required: true,
      default: [],
    },
    courseFor :{
      type: Array,
      required: true,
      default: [],
    },
    description: {
      type: String,
      default: "",
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model("Course", courseSchema);
