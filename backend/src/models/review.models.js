import mongoose from "mongoose";

const stars = [0,1,2,3,4,5,0.5,1.5,2.5,3.5,4.5]

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true
    },
    text: {
      type: String,
      required: true
    },
    star: {
      type: Number,
      enum: stars,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export const Review = mongoose.model('Review', reviewSchema);