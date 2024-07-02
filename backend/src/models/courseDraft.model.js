import mongoose from "mongoose";

const diffi = ["Beginner", "Intermediate", "Expert"]

const courseDraftSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    no_of_lectures: {
      type: Number,
      default: 0,
    },
    languages: {
      type: Array,
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    thumbnail_url: {
      type: String, //cloudinary url,
      default: ""
    },
    price: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    certificate: {
      type: Boolean,
      default: false,
    },
    about_course: {
      type: String,
      default: ""
    },
    course_includes: {
      type: Array,
      default: [],
    },
    instructor_name: {
      type: String,
      default: ""
    },
    instructor_profession: {
      type: String,
      default: ""
    },
    about_instructor: {
      type: String,
      default: ""
    },
    instructor_image_url: {
      type: String,
      default: ""
    },
    category: {
      type: Array,
      default: []
    },
    level: {
      type: String,
      enum: diffi,
      default: "Beginner",
    },
    total_time: {
      type: Number,
      default: 0
    },
    learning: {
      type: Array,
      default: []
    },
    tags: {
      type: Array,
      default: []
    },
    requirements: {
      type: Array,
      default: []
    },
    courseFor: {
      type: Array,
      default: []
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

export const CourseDraft = mongoose.model("CourseDraft", courseDraftSchema);